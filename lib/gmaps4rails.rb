module Gmaps4rails
  require 'rails'
  require 'gmaps4rails/base'
  
  class Engine < Rails::Engine
     
     initializer "gmaps4rails view helpers" do |app|
       ActionView::Base.send :include, Gmaps4railsHelper
     end
     
     initializer "deprecation warning" do |app|
       warn "[Gmaps4rails]: DEPRECATION: Javascript Gmaps.map.map is now deprecated and will be removed in later version. Please use Gmaps.map.serviceObject instead."
       warn "[Gmaps4rails]: Be sure to run 'rails g gmaps4rails:install' to get js and css files in your app they are not added automatically anymore see Readme on Github"
     end
     
  end
  
  class Railtie < Rails::Railtie
  
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
