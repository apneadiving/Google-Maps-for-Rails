module Gmaps4rails
  class Engine < Rails::Engine

    config.mount_at = '/gmaps4rails'
    config.widget_factory_name = 'Factory Name'
        
  end
end
