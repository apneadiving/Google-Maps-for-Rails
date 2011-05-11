if defined?(Rails) && Rails::VERSION::MAJOR == 3
  module Gmaps4rails
    require "rails"
    #require "action_controller"
    require 'array'
    require 'hash'  
    #require 'application_helper'
    require 'acts_as_gmappable/base'
  
    class Engine < Rails::Engine
       initializer "static assets" do |app|
         app.middleware.use ::ActionDispatch::Static, "#{root}/public"
       end
       initializer "gmaps4rails view helpers" do |app|
         require 'gmaps4rails_helper'
         ActionView::Base.send :include, Gmaps4railsHelper
       end
    end

  end
end

