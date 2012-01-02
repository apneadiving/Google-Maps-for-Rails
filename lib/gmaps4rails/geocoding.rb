require 'net/http'
require 'uri'
require 'json'

module Gmaps4rails
  
  # This method geocodes an address using the GoogleMaps webservice
  # options are:
  # * address: string, mandatory
  # * lang: to set the language one wants the result to be translated (default is english)
  # * raw: to get the raw response from google, default is false
  def Gmaps4rails.geocode(address, lang="en", raw = false, protocol = "http")
   if address.nil? || address.empty?
     raise Gmaps4rails::GeocodeInvalidQuery, "You must provide an address"
   else #coordinates are valid
     geocoder = "#{protocol}://maps.googleapis.com/maps/api/geocode/json?language=#{lang}&address="
     output = "&sensor=false"
     #send request to the google api to get the lat/lng
     request = geocoder + address + output
     url = URI.escape(request)
     Gmaps4rails.handle_geocoding_response(request, Gmaps4rails.get_response(url), raw)
   end # end address valid
  end
  
  # This method retrieves destination results provided by GoogleMaps webservice
  # options are:
  # * start_end: Hash { "from" => string, "to" => string}, mandatory
  # * options: details given in the github's wiki
  # * output: could be "pretty", "raw" or "clean"; filters the output from google
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
     Gmaps4rails.handle_destination_response(request, Gmaps4rails.get_response(url), output)
   end # end origin + destination exist
  end #end destination
  
  private
  
  def Gmaps4rails.handle_geocoding_response(request, response, raw)
    #parse result if result received properly
    if response.is_a?(Net::HTTPSuccess)             
      #parse the json
      #parse = Crack::JSON.parse(response.body)
      parse = JSON.parse(response.body)
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
      Response was: #{response}"           
    end #end resp test
  end
  
  def Gmaps4rails.handle_destination_response(request, response, output)
    if response.is_a?(Net::HTTPSuccess)             
      #parse the json
      #parse = Crack::JSON.parse(response.body)
      parse = JSON.parse(response.body)
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
      Response was: #{response}"           
    end #end resp test
  end
  
end