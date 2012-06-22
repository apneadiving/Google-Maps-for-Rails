module Gmaps4rails
  
  class Geocoder
    include BaseNetMethods
    
    attr_reader :address, :language, :raw, :protocol
    
    def initialize(address, options = {})
      raise Gmaps4rails::GeocodeInvalidQuery, "You must provide an address" if address.empty?
      
      @address  = address
      @language = options[:language] || "en"
      @raw      = options[:raw]      || false
      @protocol = options[:protocol] || "http"
    end
    
    # returns an array of hashes with the following keys:
    # - lat: mandatory for acts_as_gmappable
    # - lng: mandatory for acts_as_gmappable
    # - matched_address: facultative
    # - bounds:          facultative
    # - full_data:       facultative
    def get_coordinates
      checked_google_response do
        return parsed_response if raw
        parsed_response["results"].inject([]) do |memo, result|
          memo << { 
                   :lat             => result["geometry"]["location"]["lat"], 
                   :lng             => result["geometry"]["location"]["lng"],
                   :matched_address => result["formatted_address"],
                   :bounds          => result["geometry"]["bounds"],
                   :full_data       => result
                  }
        end
      end
    end
    
    private
    
    def base_request
      "#{protocol}://maps.googleapis.com/maps/api/geocode/json?language=#{language}&address=#{address}&sensor=false"
    end
    
    def raise_net_status
      raise Gmaps4rails::GeocodeNetStatus, "The request sent to google was invalid (not http success): #{base_request}.\nResponse was: #{response}"
    end
    
    def raise_query_error
      raise Gmaps4rails::GeocodeStatus, "The address you passed seems invalid, status was: #{parsed_response["status"]}.\nRequest was: #{base_request}"
    end
    
  end
  
end