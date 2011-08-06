module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      def copy_locale
        rails31 = Rails::VERSION::MAJOR >= 3 && Rails::VERSION::MINOR >= 1
        prefix = rails31 ? 'app/assets' : 'public'
        
        copy_file '../../../public/javascripts/gmaps4rails.base.js', "#{prefix}/javascripts/gmaps4rails.base.js"
        copy_file '../../../public/javascripts/gmaps4rails.googlemaps.js', "#{prefix}/javascripts/gmaps4rails.googlemaps.js"
        copy_file '../../../public/javascripts/gmaps4rails.bing.js', "#{prefix}/javascripts/gmaps4rails.bing.js"
        copy_file '../../../public/javascripts/gmaps4rails.openlayers.js', "#{prefix}/javascripts/gmaps4rails.openlayers.js"
        copy_file '../../../public/javascripts/gmaps4rails.mapquest.js', "#{prefix}/javascripts/gmaps4rails.mapquest.js"
        copy_file '../../../public/stylesheets/gmaps4rails.css', "#{prefix}/stylesheets/gmaps4rails.css"
        copy_file '../../../public/images/marker.png', "#{prefix}/images/marker.png"
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end
    end
  end
end
