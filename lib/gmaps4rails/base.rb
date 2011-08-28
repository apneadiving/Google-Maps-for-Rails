require 'net/http'
require 'uri'
require 'crack'

module Gmaps4rails
  DEFAULT_MAP_ID     = "map"
  
  class GeocodeStatus < StandardError; end
  class GeocodeNetStatus < StandardError; end
  class GeocodeInvalidQuery < StandardError; end
  class DirectionStatus < StandardError; end
  class DirectionNetStatus < StandardError; end
  class DirectionInvalidQuery < StandardError; end

  # Creates the json related to one Object (only tried ActiveRecord objects)
  # This json will contian the marker's attributes of the object 
  
 def Gmaps4rails.create_json(object, &block)
    unless object.send(object.gmaps4rails_options[:lat_column]).blank? && object.send(object.gmaps4rails_options[:lng_column]).blank?
"{#{Gmaps4rails.description(object)}#{Gmaps4rails.title(object)}#{Gmaps4rails.sidebar(object)}\"lng\": \"#{object.send(object.gmaps4rails_options[:lng_column])}\", \"lat\": \"#{object.send(object.gmaps4rails_options[:lat_column])}\"#{Gmaps4rails.picture(object)}#{Gmaps4rails.block_handling(object, &block)}},\n"
    end
 end  

  # execute block if provided so that it's included in the json string
  def Gmaps4rails.block_handling(object, &block)
     ", " + yield(object) if block_given?
  end
  
  # Returns description if gmaps4rails_infowindow is defined in the model
  def Gmaps4rails.description(object)
    return "\"description\": \"#{object.gmaps4rails_infowindow}\", " if object.respond_to?("gmaps4rails_infowindow")
  end
  
  # Returns title if gmaps4rails_title is defined in the model
  
  def Gmaps4rails.title(object)
    return "\"title\": \"#{object.gmaps4rails_title}\", " if object.respond_to?("gmaps4rails_title")
  end
  
  # Returns sidebar content if gmaps4rails_sidebar is defined in the model
  
  def Gmaps4rails.sidebar(object)
    return "\"sidebar\": \"#{object.gmaps4rails_sidebar}\"," if object.respond_to?("gmaps4rails_sidebar")
  end
  
  def Gmaps4rails.get_map_id(hash)
    hash.nil? || hash.try(:[], "id").nil? ? DEFAULT_MAP_ID : hash["id"]
  end
  
  def Gmaps4rails.get_constructor(hash)
    hash.nil? || hash.try(:[], "provider").nil? ? "Gmaps4RailsGoogle()" : "Gmaps4Rails#{hash["provider"].capitalize}()"
  end

  # Returns picture options if gmaps4rails_marker_picture is defined in the model
  def Gmaps4rails.picture(object)
    if object.respond_to?("gmaps4rails_marker_picture")
      ", " + object.gmaps4rails_marker_picture.map do |k,v|
        #specific case, anchors are array and should be interpreted this way
        if k.include? "_anchor"
          "\"#{k}\": [#{v[0]}, #{v[1]}]"
        else
          "\"#{k}\": \"#{v}\""
        end
      end.join(", ")
    end
  end
  
  # This method geocodes an address using the GoogleMaps webservice
  # options are:
  # * address: string, mandatory
  # * lang: to set the language one wants the result to be translated (default is english)
  # * raw: to get the raw response from google, default is false
  
  def Gmaps4rails.geocode(address, lang="en", raw = false)
   if address.nil? || address.empty?
     raise Gmaps4rails::GeocodeInvalidQuery, "You must provide an address"
   else #coordinates are valid
     geocoder = "http://maps.googleapis.com/maps/api/geocode/json?language=#{lang}&address="
     output = "&sensor=false"
     #send request to the google api to get the lat/lng
     request = geocoder + address + output
     url = URI.escape(request)
     Gmaps4rails.handle_geocoding_response(request, Net::HTTP.get_response(URI.parse(url)), raw)
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
     Gmaps4rails.handle_destination_response(request, Net::HTTP.get_response(URI.parse(url)), output)
   end # end origin + destination exist
  end #end destination
  
  # To create valid js, this method escapes everything but Numeric, true or false
  
  def Gmaps4rails.filter(data)
    return data if data.is_a?(Numeric) || data.is_a?(TrueClass) || data.is_a?(FalseClass)
    "'#{data}'"
  end
  
  private
  
  def Gmaps4rails.handle_geocoding_response(request, response, raw)
    #parse result if result received properly
    if response.is_a?(Net::HTTPSuccess)             
      #parse the json
      parse = Crack::JSON.parse(response.body)
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
      parse = Crack::JSON.parse(response.body)
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
  
  def Gmaps4rails.js_function_name(hash)
    "load_" + Gmaps4rails.get_map_id(hash[:map_options])
  end
  
  def Gmaps4rails.create_js_from_hash(hash, edit_map_with_id = false)
    #the variable 'options' must have the following structure
    #{  
    #   :map_options => hash,
    #   :markers     => { :data => json, :options => hash },
    #   :polylines   => { :data => json, :options => hash },
    #   :polygons    => { :data => json, :options => hash },
    #   :circles     => { :data => json, :options => hash },
    #   :direction   => { :data => hash, :options => hash },
    #   :kml         => { :data => json, :options => hash }
    #}
    # "map_options", "scripts" and "direction" must be treated separately because there content is slightly different from the others:
    # - "map_options" and "scripts" don't contain interesting data for the view
    # - "direction" has a hash as a data and waypoints options must be processed properly
    #
    result = Array.new
    map_id = edit_map_with_id || Gmaps4rails.get_map_id(hash[:map_options])
    map_id = "Gmaps." + map_id

    #means we are creating a new map
    if edit_map_with_id == false 

      js_object_constructor = Gmaps4rails.get_constructor(hash[:map_options])
      result << "#{map_id} = new #{js_object_constructor}" + ";"
      result << "function #{Gmaps4rails.js_function_name(hash)}() {"
      #extract map_options
      unless hash[:map_options].nil?
        hash[:map_options].each do |option_k, option_v|
          if option_k == "bounds" #particular case
            result << "#{map_id}.map_options.#{option_k} = #{option_v};"
          else
            result << "#{map_id}.map_options.#{option_k} = #{Gmaps4rails.filter option_v};"
          end
        end
      end

      result << "#{map_id}.initialize();"
    end

    hash.each do |category, content| #loop through options hash
      case category
      when "map_options"
        #already taken into account above => nothing to do here
      when "scripts"
        #nothing to do 
      when "direction"
        result <<  "#{map_id}.direction_conf.origin = '#{content["data"]["from"]}';"
        result << "#{map_id}.direction_conf.destination = '#{content["data"]["to"]}';"

        content[:options] ||= Array.new 
    	  content[:options].each do |option_k, option_v| 
          if option_k == "waypoints"
            waypoints = Array.new
            option_v.each do |waypoint|
              waypoints << { "location" => waypoint, "stopover" => true }.to_json
            end
            result << "#{map_id}.direction_conf.waypoints = [#{waypoints * (",")}];"
          else #option_k != "waypoint"
            result << "#{map_id}.direction_conf.#{option_k} = #{Gmaps4rails.filter option_v};"	
          end
        end #end .each
        result << "#{map_id}.create_direction();"
      else #default behaviour in case condition
        result << "#{map_id}.#{category} = #{content[:data]};"
        content[:options] ||= Array.new 
        content[:options].each do |option_k, option_v|
          result << "#{map_id}.#{category}_conf.#{option_k} = #{Gmaps4rails.filter option_v};"		
        end
        result << "#{map_id}.create_#{category}();"
      end 
    end
    result << "#{map_id}.callback();"
    
    if edit_map_with_id == false 
      result << "};\nwindow.onload = #{Gmaps4rails.js_function_name(hash)};"
    end
    
    result * ('
')
  end

end