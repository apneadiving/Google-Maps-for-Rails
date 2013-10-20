require 'ostruct'

module Gmaps4rails
  autoload :JsonBuilder,      'gmaps4rails/json_builder'

  def Gmaps4rails.create_json(object, &block)
    ::Gmaps4rails::JsonBuilder.new(object).process(&block)
  end

  def Gmaps4rails.condition_eval(object, condition)
    case condition
    when Symbol, String        then object.send condition
    when Proc                  then condition.call(object)
    when TrueClass, FalseClass then condition
    end
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
