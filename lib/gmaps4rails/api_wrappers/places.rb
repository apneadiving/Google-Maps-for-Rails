module Gmaps4rails

  class Places
    
    include BaseNetMethods
    
    attr_reader :lat, :lng
    delegate :key, :keyword, :radius, :lang, :raw, :protocol, :to => :@options
        
    def initialize(lat, lng, options = {})
      @lat, @lng = lat, lng
      raise_invalid     unless valid_position?
      raise_missing_key unless options[:key]
      options[:radius]  ||= 7500
      options[:lang]    ||= "en"
      options[:raw]     ||= false
      options[:protocol]||= "http"
      @options = OpenStruct.new options
    end
    
    def get
      checked_google_response do
        return parsed_response if raw
        parsed_response["results"].inject([]) do |memo, result|
          memo << { 
                   :lat       => result["geometry"]["location"]["lat"], 
                   :lng       => result["geometry"]["location"]["lng"],
                   :name      => result["name"],
                   :reference => result["reference"],
                   :vicinity  => result["vicinity"],
                   :full_data => result
                  }
        end
      end
    end
    
    private
    
    def base_request
      req = "#{protocol}://maps.googleapis.com/maps/api/place/search/json?language=#{lang}&location=#{lat},#{lng}&sensor=false&radius=#{radius}&key=#{key}"
      req += "&keyword=#{keyword}" unless keyword.nil?
      req
    end
    
    def valid_position?
      !(lat.nil? || lng.nil?)
    end
    
    def raise_invalid
      raise Gmaps4rails::PlacesInvalidQuery, "You must provide at least a lat/lon for a Google places query"
    end
    
    def raise_missing_key
      raise "Google Places API requires an API key"
    end
    
    def raise_net_status
      raise Gmaps4rails::PlacesNetStatus, "The request sent to google was invalid (not http success): #{base_request}.\nResponse was: #{response}"
    end
    
    def raise_query_error
      raise Gmaps4rails::PlacesStatus, "The address you passed seems invalid, status was: #{parsed_response["status"]}.\nRequest was: #{base_request}"
    end
    
    def get_response
      uri     = URI.parse(base_url)
      http    = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl     = true # Places API wants https
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE # to avoid any cert issues
      http.request(Net::HTTP::Get.new(uri.request_uri))
    end
    
  end
end