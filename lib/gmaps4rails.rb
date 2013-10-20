if defined?(::Rails)
  require 'gmaps4rails/rails/engine' if ::Rails.version >= '3.1'
  require 'gmaps4rails/rails/railtie'
end
require 'gmaps4rails/version'

module Gmaps4rails
  autoload :MarkersBuilder, 'gmaps4rails/markers_builder'

  module Rails
  end

  def Gmaps4rails.build_markers(collection, &block)
    ::Gmaps4rails::MarkersBuilder.new(collection).call(&block)
  end
end
