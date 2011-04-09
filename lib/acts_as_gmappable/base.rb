require 'net/http'
require 'uri'
require 'crack'
require 'logger'

module Gmaps4rails
  
  class GeocodeStatus < StandardError; end
  class GeocodeNetStatus < StandardError; end
  class GeocodeInvalidQuery < StandardError; end
  class DirectionStatus < StandardError; end
  class DirectionNetStatus < StandardError; end
  class DirectionInvalidQuery < StandardError; end
  
  def Gmaps4rails.create_json(object)
    unless object[object.gmaps4rails_options[:lat_column]].blank? && object[object.gmaps4rails_options[:lng_column]].blank?
"{
\"description\": \"#{object.gmaps4rails_infowindow}\", \"title\": \"#{object.gmaps4rails_title}\", \"sidebar\": \"#{object.gmaps4rails_sidebar}\",
\"longitude\": \"#{object[object.gmaps4rails_options[:lng_column]]}\", \"latitude\": \"#{object[object.gmaps4rails_options[:lat_column]]}\", \"picture\": \"#{object.gmaps4rails_marker_picture['picture']}\", \"width\": \"#{object.gmaps4rails_marker_picture['width']}\", \"height\": \"#{object.gmaps4rails_marker_picture['height']}\"
} ,"
    end
  end  
  
  def Gmaps4rails.geocode(address, raw = false)
   if address.nil? || address.empty?
     raise Gmaps4rails::GeocodeInvalidQuery, "You must provide an address"
   else #coordinates are valid
     geocoder = "http://maps.googleapis.com/maps/api/geocode/json?address="
     output = "&sensor=false"
     #send request to the google api to get the lat/lng
     request = geocoder + address + output
     url = URI.escape(request)
     resp = Net::HTTP.get_response(URI.parse(url))
     #parse result if result received properly
     if resp.is_a?(Net::HTTPSuccess)             
       #parse the json
       parse = Crack::JSON.parse(resp.body)
       #logger.debug "Google geocoding. Address: #{address}. Result: #{resp.body}"
       #check if google went well
       if parse["status"] == "OK"
         return parse if raw == true
         array = []
         parse["results"].each do |result|
           array << { 
                      :lat => result["geometry"]["location"]["lat"], 
                      :lng => result["geometry"]["location"]["lng"],
                      :matched_address => result["formatted_address"],
                      :bounds => result["geometry"]["bounds"]
                     }
         end
         return array
       else #status != OK
         raise Gmaps4rails::GeocodeStatus, "The address you passed seems invalid, status was: #{parse["status"]}.
         Request was: #{request}"
       end #end parse status
       
     else #if not http success
       raise Gmaps4rails::GeocodeNetStatus, "The request sent to google was invalid (not http success): #{request}.
       Response was: #{resp}"           
     end #end resp test
   end # end address valid
  end #end geocode
  
  #output could be raw, pretty or clean
  def Gmaps4rails.destination(start_end, options={}, output="pretty")
   if start_end["from"].nil? || start_end["to"].empty?
     raise Gmaps4rails::DirectionInvalidQuery, "Origin and destination must be provided in a hash as first argument"
   else #great, we have stuff to work with
     geocoder = "http://maps.googleapis.com/maps/api/directions/json?origin=#{start_end["from"]}&destination=#{start_end["to"]}"
     #if value is an Array, it means it contains the waypoints, otherwise it's chained normally
     dest_options = options.empty? ? "" : "&" + options.map {|k,v| v.is_a?(Array) ? k + "=" + v * ("|") : k + "=" + v }*("&") 
     #send request to the google api to get the directions
     request = geocoder + dest_options + "&sensor=false"
     url = URI.escape(request)
     resp = Net::HTTP.get_response(URI.parse(url))
     #parse result if result received properly
     if resp.is_a?(Net::HTTPSuccess)             
       #parse the json
       parse = Crack::JSON.parse(resp.body)
       #check if google went well
       if parse["status"] == "OK"
        legs = []
        #Each element in the legs array specifies a single leg of the journey from the origin to the destination in the calculated route
        parse["routes"].first["legs"].each do |leg|
          #delete coded polyline elements from legs and store it in polylines to make output cleaner
          polylines = leg["steps"].map {|step| step.delete("polyline")} if output == "pretty" || output == "clean"
          legs << {
                    "duration"  => { "text" => leg["duration"]["text"], "value" => leg["duration"]["value"].to_f },
                    "distance"  => { "text" => leg["distance"]["text"], "value" => leg["distance"]["value"].to_f },
                    "steps"     => leg["steps"]
                  }
          if output == "pretty"
            #polylines contain levels data, which are not that useful.
            polylines.map{|poly| poly.delete("levels")}
            #creat valid json from all polylines, this could be directly passed to javascript for display
            json = polylines.map { |poly| {"coded_array" => poly["points"]} }.to_json
            #merge results in legs
            legs.last.merge!({ "polylines" => json })
          end
        end
        return legs
       else #status != OK
         raise Gmaps4rails::DirectionStatus, "The query you passed seems invalid, status was: #{parse["status"]}.
         Request was: #{request}"
       end #end parse status
     else #if not http success
       raise Gmaps4rails::DirectionNetStatus, "The request sent to google was invalid (not http success): #{request}.
       Response was: #{resp}"           
     end #end resp test
   end # end origin + destination exist
  end #end destination
  
  
  def Gmaps4rails.filter(data)
    return data if data.is_a?(Numeric) || data.is_a?(TrueClass) || data.is_a?(FalseClass)
    "'#{data}'"
  end
  
  module ActsAsGmappable

    extend ActiveSupport::Concern
    
    module InstanceMethods
      def gmaps4rails_infowindow
      end
        
      def gmaps4rails_title
      end
      
      def gmaps4rails_sidebar
      end
        
      def process_geocoding
        #to prevent geocoding each time a save is made
        return true if gmaps4rails_options[:check_process] == true && self[gmaps4rails_options[:checker]] == true
        
        begin
          coordinates = Gmaps4rails.geocode(self.gmaps4rails_address)
        rescue GeocodeStatus #adress was invalid, add error to base.
          errors[:base] << gmaps4rails_options[:msg] if gmaps4rails_options[:validation]
        rescue GeocodeNetStatus => e #connection error, No need to prevent save.
          logger.warn(e)
          #TODO add customization here?
        else #if no exception
          self[gmaps4rails_options[:lng_column]] = coordinates.first[:lng]
          self[gmaps4rails_options[:lat_column]] = coordinates.first[:lat]
          if gmaps4rails_options[:check_process] == true
            self[gmaps4rails_options[:checker]] = true
          end
        end
      end
        
      def gmaps4rails_marker_picture
        {
          "picture" => "",
          "width" => "",
          "height" => ""
        }
      end
        
      def self.gmaps4rails_trusted_scopes
        []
      end
        
      def to_gmaps4rails
        json = "["
        json += Gmaps4rails.create_json(self).to_s.chop #removes the extra comma
        json += "]"
      end
        
    end
    
    module ClassMethods
      mattr_accessor :gmaps4rails_options
      
      def acts_as_gmappable args = {}          
        unless args[:process_geocoding] == false
          validate :process_geocoding
        end

        # [:lat, :lng, :check_process, :checker, :msg, :validation].each do |sym|
        #   Gmaps4rails::ActsAsGmappable.gmaps4rails_options[sym] = args[sym] unless args[sym].nil?
        # end
        
        Gmaps4rails::ActsAsGmappable::ClassMethods.gmaps4rails_options = args        
        
        #instance method
        define_method "gmaps4rails_options" do
          {
            :lat_column     => args[:lat]                 || "latitude",
            :lng_column     => args[:lng]                 || "longitude",
            :check_process  => args[:check_process].nil?  ?   true : args[:check_process],
            :checker        => args[:checker]             || "gmaps",
            :msg            => args[:msg]                 || "Address invalid",
            :validation     => args[:validation].nil?     ?   true : args[:validation]
            #TODO: address as a proc?
          }
        end
      end
      include InstanceMethods
    end
    
  end #ActsAsGmappable
end

ActiveSupport.on_load(:active_record) do
  ActiveRecord::Base.send(:include, Gmaps4rails::ActsAsGmappable)
end
#::ActiveRecord::Base.send :include, Gmaps4rails::ActsAsGmappable
# Mongoid::Document::ClassMethods.class_eval do
#   include Gmaps4rails::ActsAsGmappable::Base
# end