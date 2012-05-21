module Gmaps4rails
  require 'rails'
  require 'gmaps4rails/base'
  
  class Engine < Rails::Engine
     
     initializer "gmaps4rails view helpers" do |app|
       ActionView::Base.send :include, Gmaps4railsHelper
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
