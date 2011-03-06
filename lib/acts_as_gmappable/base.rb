require 'net/http'
require 'uri'
require 'crack'
require 'logger'

module Gmaps4rails
  
  class GeocodeStatus < StandardError; end
  class GeocodeNetStatus < StandardError; end
  
  def Gmaps4rails.create_json(object)
    unless object[object.gmaps4rails_options[:lat_column]].blank? && object[object.gmaps4rails_options[:lng_column]].blank?
"{\"description\": \"#{object.gmaps4rails_infowindow}\",
\"longitude\": \"#{object[object.gmaps4rails_options[:lng_column]]}\",
\"latitude\": \"#{object[object.gmaps4rails_options[:lat_column]]}\",
\"picture\": \"#{object.gmaps4rails_marker_picture['picture']}\",
\"width\": \"#{object.gmaps4rails_marker_picture['width']}\",
\"height\": \"#{object.gmaps4rails_marker_picture['height']}\"
} ,"
    end
  end
  
  def Gmaps4rails.geocode(address)
   if address.nil? || address.empty?
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
         array = []
         parse["results"].each do |result|
           array << { :lat => result["geometry"]["location"]["lat"], 
                      :lng => result["geometry"]["location"]["lng"],
                      :matched_address => result["formatted_address"] }
         end
         return array
       else #status != OK
         raise Gmaps4rails::GeocodeStatus, "The adress you passed seems invalid, status was: #{parse["status"]}.
         Request was: #{request}"
       end #end parse status
       
     else #if not http success
       raise Gmaps4rails::GeocodeNetStatus, "The request sent to google was invalid (not http success): #{request}.
       Response was: #{resp}"           
     end #end resp test
     
   end # end address valid
  end #end geocode
  
  module ActsAsGmappable

    module Base
      def self.included(klass)
        klass.class_eval do
          extend Config
        end
      end
      
      module Config
        def acts_as_gmappable args = {}          
         unless args[:process_geocoding] == false
            validate :process_geocoding
         end
          
          define_method "gmaps4rails_options" do
            {
              :lat_column => args[:lat] || "latitude",
              :lng_column => args[:lng] || "longitude",
              :check_process => args[:check_process] || true,
              :checker => args[:checker] || "gmaps",
              :msg => args[:msg] || "Address invalid",
              :validation => args[:validation] || true
              #TODO: address as a proc?
            }
          end
                 
          include Gmaps4rails::ActsAsGmappable::Base::InstanceMethods
        end
      end
      
      module InstanceMethods
        
        def gmaps4rails_infowindow
        end
        
        def process_geocoding
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
            if gmaps4rails_options[:check_process] = true
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
        
      end # InstanceMethods      
    end
  end
end

::ActiveRecord::Base.send :include, Gmaps4rails::ActsAsGmappable::Base
