require 'gmaps4rails/acts_as_gmappable'

require 'gmaps4rails/js_handler'
require 'gmaps4rails/json_handler'
require 'gmaps4rails/geocoding'
require 'gmaps4rails/google_places'
require 'gmaps4rails/extensions/array'
require 'gmaps4rails/extensions/hash'

require 'gmaps4rails/helper/gmaps4rails_helper'

module Gmaps4rails

  class GeocodeStatus         < StandardError; end
  class GeocodeNetStatus      < StandardError; end
  class GeocodeInvalidQuery   < StandardError; end
  
  class DirectionStatus       < StandardError; end
  class DirectionNetStatus    < StandardError; end
  class DirectionInvalidQuery < StandardError; end
  
  class PlacesStatus          < StandardError; end
  class PlacesNetStatus       < StandardError; end
  class PlacesInvalidQuery    < StandardError; end

  mattr_accessor :http_proxy
  
  def Gmaps4rails.condition_eval(object, condition)
    case condition
    when Symbol     then object.send condition
    when Proc       then condition.call(object)
    when TrueClass  then condition
    when FalseClass then condition
    end
  end
  
  private
  
  # To create valid js, this method escapes everything but Numeric, true or false
  def Gmaps4rails.filter(data)
    data.to_json
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