if defined?(Rails) && Rails::VERSION::MAJOR == 3
  module Gmaps4rails
    require 'rails'
    require 'gmaps4rails/base'
    
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
       
       initializer "include acts_as_gmappable within ORM" do
         ActiveSupport.on_load(:active_record) do
           ActiveRecord::Base.send(:include, Gmaps4rails::ActsAsGmappable)
         end
         
         ActiveSupport.on_load(:mongoid) do
           Mongoid::Document.send(:include, Gmaps4rails::ActsAsGmappable)
         end
       end
       
    end
  end
end