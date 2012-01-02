if defined?(Rails) && Rails::VERSION::MAJOR == 3
  module Gmaps4rails
    require 'rails'
    require 'gmaps4rails/base'
    require 'gmaps4rails/js_handler'
    require 'gmaps4rails/json_handler'
    require 'gmaps4rails/geocoding'
    require 'gmaps4rails/acts_as_gmappable'
    require 'gmaps4rails/extensions/array'
    require 'gmaps4rails/extensions/hash'
    require 'gmaps4rails/helper/gmaps4rails_helper'
    
    class Engine < Rails::Engine
       initializer "gmaps4rails view helpers" do |app|
         ActionView::Base.send :include, Gmaps4railsHelper
       end
       initializer "add asset directories to pipeline" do |app|
         if Rails::VERSION::MINOR >= 1
           app.config.assets.paths << "#{root}/public/stylesheets"
         else
           app.middleware.use ::ActionDispatch::Static, "#{root}/public"
         end
       end
    end

  end
end