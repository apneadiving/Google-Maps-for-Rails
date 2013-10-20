require 'ostruct'

module Gmaps4rails
  autoload :MarkersBuilder, 'gmaps4rails/markers_builder'

  def Gmaps4rails.build_markers(collection, &block)
    ::Gmaps4rails::MarkersBuilder.new(collection).call(&block)
  end

  # checks whether or not the app has pipeline enabled
  # works for Rails 3.0.x and above
  # @return [Boolean]
  def Gmaps4rails.pipeline_enabled?
    return false unless Rails.configuration.respond_to?('assets')
    assets = Rails.configuration.assets
    assets.enabled.nil? || assets.enabled
  end

end
