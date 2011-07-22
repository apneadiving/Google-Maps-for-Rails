module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      def copy_locale
        src_dir   = '../../../app/assets'
        dest_dirs = public_asset_paths

        copy_file src_dir + '/javascripts/gmaps4rails.js',            dest_dirs[:js]  + '/gmaps4rails.js'
        copy_file src_dir + '/javascripts/gmaps4rails.googlemaps.js', dest_dirs[:js]  + '/gmaps4rails.googlemaps.js'
        copy_file src_dir + '/javascripts/gmaps4rails.bing.js',       dest_dirs[:js]  + '/gmaps4rails.bing.js'
        copy_file src_dir + '/javascripts/gmaps4rails.openlayers.js', dest_dirs[:js]  + '/gmaps4rails.openlayers.js'
        copy_file src_dir + '/javascripts/gmaps4rails.mapquest.js',   dest_dirs[:js]  + '/gmaps4rails.mapquest.js'
        copy_file src_dir + '/stylesheets/gmaps4rails.css',           dest_dirs[:css] + '/gmaps4rails.css'
        copy_file src_dir + '/images/marker.png',                     dest_dirs[:img] + '/marker.png'
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end

  private
      def rails_version
        property = Rails::Info.properties.find { |p| p[0] == "Rails version" }
        return property[1]
      end

      def public_asset_paths
        if Gem::Version.new(rails_version) < Gem::Version.new("3.1.0.beta")
          return {
            :js  => 'public/javascripts',
            :css => 'public/stylesheets',
            :img => 'public/images'
          }
        else
          return {
            :js  => 'public/assets',
            :css => 'public/assets',
            :img => 'public/assets'
          }
        end
      end
    end
  end
end
