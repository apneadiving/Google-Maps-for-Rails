module Gmaps4rails
  
  # does two things... 1) gecode the given address string and 2) triggers a a places query around that geo location
  # optionally a keyword can be given for a filter over all places fields (e.g. "Bungy" to give all Bungy related places)
  # IMPORTANT: Places API calls require an API key (param "key")
 
  def Gmaps4rails.places_for_address(address, key, keyword = nil, radius = 7500, lang="en", raw = false)
    if address.nil?
      raise Gmaps4rails::GeocodeInvalidQuery, "you must provide an address for a places_for_address query"
    elsif key.nil?
      raise "Google Places API requires an API key"
    else
      res = Gmaps4rails.geocode(address)  # will throw exception if nothing could be geocoded
      Gmaps4rails.places(res.first[:lat], res.first[:lng], key, keyword, radius, lang, raw)
    end
  end
  
  # does a places query around give geo location (lat/lng)
  # optionally a keyword can be given for a filter over all places fields (e.g. "Bungy" to give all Bungy related places)
  # IMPORTANT: Places API calls require an API key (param "key")
  def Gmaps4rails.places(lat, lng, key, keyword = nil, radius = 7500, lang="en", raw = false, protocol = "https")
    if lat.nil? || lng.nil?
      raise Gmaps4rails::PlacesInvalidQuery, "You must provide at least a lat/lon for a Google places query"
    elsif key.nil?
      raise "Google Places API requires an API key"
    else #lat/lng are valid
      geocoder = "#{protocol}://maps.googleapis.com/maps/api/place/search/json?language=#{lang}&location=#{[lat.to_s, lng.to_s].join(",")}"
      output = "&sensor=false&radius=#{radius}&key=#{key}"
 
      # add filter keyword
      geocoder += "&keyword=#{keyword}" unless keyword.nil?
      
      #send request to the google api to get the lat/lng
      request = geocoder + output
      url     = URI.escape(request)
      uri     = URI.parse(url)
      http    = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl     = true # Places API wants https
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE # to avoid any cert issues
      
      Gmaps4rails.handle_places_response(request, http.request(Net::HTTP::Get.new(uri.request_uri)), raw)
    end # end lat/lng valid  
  end
  
  # handles the places query response
  def Gmaps4rails.handle_places_response(request, response, raw)
    #parse result if result received properly
    if response.is_a?(Net::HTTPSuccess)
      #parse the json
      parse = JSON.parse(response.body)
      #check if google went well
      if parse["status"] == "OK"
        return parse if raw == true
        array = []
        parse["results"].each do |result|
          array << { 
                     :lat => result["geometry"]["location"]["lat"], 
                     :lng => result["geometry"]["location"]["lng"],
                     :name => result["name"],
                     :reference => result["reference"],
                     :vicinity => result["vicinity"],
                     :full_data => result
                    }
        end
        return array
      else #status != OK
        raise Gmaps4rails::PlacesStatus, "The address you passed seems invalid, status was: #{parse["status"]}.
        Request was: #{request}"
      end #end parse status
      
    else #if not http success
      raise Gmaps4rails::PlacesNetStatus, "The request sent to google was invalid (not http success): #{request}.
      Response was: #{response}"           
    end #end resp test
  end
end