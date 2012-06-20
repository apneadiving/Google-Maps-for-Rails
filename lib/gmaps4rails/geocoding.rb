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
    ::Gmaps4rails::Geocoder.new(address, {
      :language => lang, 
      :raw      => raw,
      :protocol => protocol
    }).get_coordinates
  end
  
  class Geocoder
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
    
    def base_url
      URI.escape base_request
    end
    
    def response
      @response ||= Gmaps4rails.get_response(base_url)
    end
    
    def checked_google_response(&block)
      raise_net_status unless valid_response?
      
      raise_address_error(parsed_response["status"]) unless valid_parsed_response?
      
      yield
    end
    
    def valid_response?
      response.is_a?(Net::HTTPSuccess)
    end
    
    def valid_parsed_response?
      parsed_response["status"] == "OK"
    end
    
    def parsed_response
      @parsed_response ||= JSON.parse(response.body)
    end
    
    def raise_net_status
      raise Gmaps4rails::GeocodeNetStatus, "The request sent to google was invalid (not http success): #{base_request}.\nResponse was: #{response}"
    end
    
    def raise_address_error(status)
      raise Gmaps4rails::GeocodeStatus, "The address you passed seems invalid, status was: #{status}.\nRequest was: #{base_request}"
    end
    
  end
  
end