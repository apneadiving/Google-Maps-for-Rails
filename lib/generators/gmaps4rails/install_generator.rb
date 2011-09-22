module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      def copy_locale
        if Rails::VERSION::MINOR >= 1
          copy_file '../../../app/assets/javascripts/gmaps4rails/gmaps4rails.base.js.coffee',       'app/assets/javascripts/gmaps4rails/gmaps4rails.base.js.coffee'
          copy_file '../../../app/assets/javascripts/gmaps4rails/gmaps4rails.googlemaps.js.coffee', 'app/assets/javascripts/gmaps4rails/gmaps4rails.googlemaps.js.coffee'
          copy_file '../../../app/assets/javascripts/gmaps4rails/gmaps4rails.openlayers.js.coffee', 'app/assets/javascripts/gmaps4rails/gmaps4rails.openlayers.js.coffee'
          copy_file '../../../app/assets/javascripts/gmaps4rails/gmaps4rails.bing.js.coffee',       'app/assets/javascripts/gmaps4rails/gmaps4rails.bing.js.coffee'
          copy_file '../../../app/assets/javascripts/gmaps4rails/gmaps4rails.mapquest.js.coffee',   'app/assets/javascripts/gmaps4rails/gmaps4rails.mapquest.js.coffee'        
          copy_file '../../../public/stylesheets/gmaps4rails.css', 'app/assets/stylesheets/gmaps4rails.css'
        else
        #I don't copy manifests, kind of useless
          copy_file '../../../public/javascripts/gmaps4rails/gmaps4rails.base.js',       'public/javascripts/gmaps4rails/gmaps4rails.base.js'
          copy_file '../../../public/javascripts/gmaps4rails/gmaps4rails.googlemaps.js', 'public/javascripts/gmaps4rails/gmaps4rails.googlemaps.js'
          copy_file '../../../public/javascripts/gmaps4rails/gmaps4rails.bing.js',       'public/javascripts/gmaps4rails/gmaps4rails.bing.js'
          copy_file '../../../public/javascripts/gmaps4rails/gmaps4rails.openlayers.js', 'public/javascripts/gmaps4rails/gmaps4rails.openlayers.js'
          copy_file '../../../public/javascripts/gmaps4rails/gmaps4rails.mapquest.js',   'public/javascripts/gmaps4rails/gmaps4rails.mapquest.js'
          copy_file '../../../public/stylesheets/gmaps4rails.css',                       'public/stylesheets/gmaps4rails.css'
        end
        copy_file '../../../public/images/marker.png', 'public/images/marker.png'
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end
    end
  end
end
