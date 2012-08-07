require 'net/http'
require 'uri'
require 'json'
require 'ostruct'

module Gmaps4rails
  
  require 'gmaps4rails/extensions/enumerable'
  require 'gmaps4rails/extensions/hash'
  
  autoload :ModelHandler,     'gmaps4rails/model_handler'
  autoload :ActsAsGmappable,  'gmaps4rails/acts_as_gmappable'

  autoload :JsBuilder,        'gmaps4rails/js_builder'
  autoload :JsonBuilder,      'gmaps4rails/json_builder'
  autoload :ViewHelper,       'gmaps4rails/view_helper'
  autoload :Gmaps4railsHelper,'gmaps4rails/helper/gmaps4rails_helper'
  
  autoload :BaseNetMethods,   'gmaps4rails/api_wrappers/base_net_methods'
  autoload :Geocoder,         'gmaps4rails/api_wrappers/geocoder'
  autoload :Direction,        'gmaps4rails/api_wrappers/direction'
  autoload :Places,           'gmaps4rails/api_wrappers/places'
  autoload :ObjectAccessor,   'gmaps4rails/object_accessor'

  mattr_accessor :http_proxy, :escape_js_url

  self.escape_js_url = true
  
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
  
  def Gmaps4rails.create_json(object, &block)
    ::Gmaps4rails::JsonBuilder.new(object).process(&block)
  end
  
  def Gmaps4rails.create_js_from_hash(hash)
    ::Gmaps4rails::JsBuilder.new(hash).create_js
  end
  
  # This method retrieves destination results provided by GoogleMaps webservice
  # options are:
  # * start_end: Hash { "from" => string, "to" => string}, mandatory
  # * options: details given in the github's wiki
  # * output: could be "pretty", "raw" or "clean"; filters the output from google
  #output could be raw, pretty or clean
  def Gmaps4rails.destination(start_end, options={}, output="pretty")
     Gmaps4rails::Direction.new(start_end, options, output).get
  end
  
  # does two things... 1) gecode the given address string and 2) triggers a a places query around that geo location
  # optionally a keyword can be given for a filter over all places fields (e.g. "Bungy" to give all Bungy related places)
  # IMPORTANT: Places API calls require an API key (param "key")
 
  def Gmaps4rails.places_for_address(address, key, keyword = nil, radius = 7500, lang="en", raw = false)
    raise Gmaps4rails::GeocodeInvalidQuery, "you must provide an address for a places_for_address query" if address.nil?
    raise "Google Places API requires an API key" if key.nil?
    res = Gmaps4rails.geocode(address)  # will throw exception if nothing could be geocoded
    Gmaps4rails.places(res.first[:lat], res.first[:lng], key, keyword, radius, lang, raw)
  end
  
  # does a places query around give geo location (lat/lng)
  # optionally a keyword can be given for a filter over all places fields (e.g. "Bungy" to give all Bungy related places)
  # IMPORTANT: Places API calls require an API key (param "key")
  def Gmaps4rails.places(lat, lng, key, keyword = nil, radius = 7500, lang="en", raw = false, protocol = "https")
    Gmaps4rails::Places.new(lat, lng, {
      :key      => key,
      :keyword  => keyword,
      :radius   => radius, 
      :lang     => lang,
      :raw      => raw,
      :protocol => protocol
    }).get
  end
  
  private
  
  class GeocodeStatus         < StandardError; end
  class GeocodeNetStatus      < StandardError; end
  class GeocodeInvalidQuery   < StandardError; end
  
  class DirectionStatus       < StandardError; end
  class DirectionNetStatus    < StandardError; end
  class DirectionInvalidQuery < StandardError; end
  
  class PlacesStatus          < StandardError; end
  class PlacesNetStatus       < StandardError; end
  class PlacesInvalidQuery    < StandardError; end
  
  def Gmaps4rails.condition_eval(object, condition)
    case condition
    when Symbol, String        then object.send condition
    when Proc                  then condition.call(object)
    when TrueClass, FalseClass then condition
    end
  end
  
  # looks for proxy settings and returns a Net::HTTP or Net::HTTP::Proxy class
  def Gmaps4rails.http_agent
    proxy = ENV['HTTP_PROXY'] || ENV['http_proxy'] || self.http_proxy
    if proxy
      proxy = URI.parse(proxy)
      http_agent = Net::HTTP::Proxy(proxy.host,proxy.port)
    else
      http_agent = Net::HTTP
    end
    http_agent
  end
  
end