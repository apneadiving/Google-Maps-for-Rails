module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      def copy_locale
        copy_file '../../../public/javascripts/gmaps4rails.js', 'public/javascripts/gmaps4rails.js'
        copy_file '../../../public/javascripts/gmaps4rails.googlemaps.js', 'public/javascripts/gmaps4rails.googlemaps.js'
        copy_file '../../../public/javascripts/gmaps4rails.bing.js', 'public/javascripts/gmaps4rails.bing.js'
        copy_file '../../../public/javascripts/gmaps4rails.openlayers.js', 'public/javascripts/gmaps4rails.openlayers.js'
        copy_file '../../../public/javascripts/gmaps4rails.mapquest.js', 'public/javascripts/gmaps4rails.mapquest.js'
        copy_file '../../../public/stylesheets/gmaps4rails.css', 'public/stylesheets/gmaps4rails.css'
        copy_file '../../../public/images/marker.png', 'public/images/marker.png'
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end
    end
  end
end
