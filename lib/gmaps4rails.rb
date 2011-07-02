if defined?(Rails) && Rails::VERSION::MAJOR == 3
  module Gmaps4rails
    require 'rails'
    require 'extensions/array'
    require 'extensions/hash'  
    require 'gmaps4rails/base'
    require 'gmaps4rails/acts_as_gmappable'
    require 'helper/gmaps4rails_helper'
  
    class Engine < Rails::Engine
       initializer "static assets" do |app|
         app.middleware.use ::ActionDispatch::Static, "#{root}/public"
       end
       initializer "gmaps4rails view helpers" do |app|
         ActionView::Base.send :include, Gmaps4railsHelper
       end
    end

  end
end

