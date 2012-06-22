require 'net/http'
require 'uri'
require 'json'
require 'ostruct'

module Gmaps4rails
  
  require 'gmaps4rails/extensions/array'
  require 'gmaps4rails/extensions/hash'
  
  autoload :ModelHandler,     'gmaps4rails/model_handler'
  autoload :ActsAsGmappable,  'gmaps4rails/acts_as_gmappable'

  autoload :JsBuilder,        'gmaps4rails/js_builder'
  autoload :JsonBuilder,      'gmaps4rails/json_builder'
  autoload :ViewHelper,       'gmaps4rails/view_helper'
  autoload :Geocoder,         'gmaps4rails/geocoder'
  autoload :Gmaps4railsHelper,'gmaps4rails/helper/gmaps4rails_helper'
  #autoload :Destination       'gmaps4rails/destination'
  #autoload 'gmaps4rails/google_places'

  mattr_accessor :http_proxy
  
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
  
  private
  
  class GeocodeStatus         < StandardError; end
  class GeocodeNetStatus      < StandardError; end
  class GeocodeInvalidQuery   < StandardError; end
  
  def Gmaps4rails.condition_eval(object, condition)
    case condition
    when Symbol, String        then object.send condition
    when Proc                  then condition.call(object)
    when TrueClass, FalseClass then condition
    end
  end

  # get the response from the url encoded address string
  def Gmaps4rails.get_response(url)
    url = URI.parse(url)
    http = Gmaps4rails.http_agent
    http.get_response(url)
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