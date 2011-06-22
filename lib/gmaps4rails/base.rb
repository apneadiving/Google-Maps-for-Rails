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
    unless object.send(object.gmaps4rails_options[:lat_column]).blank? && object.send(object.gmaps4rails_options[:lng_column]).blank?
"{#{Gmaps4rails.description(object)}#{Gmaps4rails.title(object)}#{Gmaps4rails.sidebar(object)}\"longitude\": \"#{object.send(object.gmaps4rails_options[:lng_column])}\", \"latitude\": \"#{object.send(object.gmaps4rails_options[:lat_column])}\"#{Gmaps4rails.picture(object)}},\n"
    end
  end  
  
  def Gmaps4rails.description(object)
    return "\"description\": \"#{object.gmaps4rails_infowindow}\", " if object.respond_to?("gmaps4rails_infowindow")
  end
  
  def Gmaps4rails.title(object)
    return "\"title\": \"#{object.gmaps4rails_title}\", " if object.respond_to?("gmaps4rails_title")
  end
  
  def Gmaps4rails.sidebar(object)
    return "\"sidebar\": \"#{object.gmaps4rails_sidebar}\"," if object.respond_to?("gmaps4rails_sidebar")
  end
  
  def Gmaps4rails.picture(object)
    return ", \"picture\": \"#{object.gmaps4rails_marker_picture['picture']}\", \"width\": \"#{object.gmaps4rails_marker_picture['width']}\", \"height\": \"#{object.gmaps4rails_marker_picture['height']}\"" if object.respond_to?("gmaps4rails_marker_picture")
  end
  
  def Gmaps4rails.geocode(address, lang="en", raw = false)
   if address.nil? || address.empty?
     raise Gmaps4rails::GeocodeInvalidQuery, "You must provide an address"
   else #coordinates are valid
     geocoder = "http://maps.googleapis.com/maps/api/geocode/json?language=#{lang}&address="
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
                      :bounds => result["geometry"]["bounds"],
                      :full_data => result
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
            #create valid json from all polylines, this could be directly passed to javascript for display
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

end