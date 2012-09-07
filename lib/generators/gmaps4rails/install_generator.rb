module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      class_option :views, :type => :boolean, :default => false, :desc => 'copy partials to app/views of Rails app'

      def copy_locale
        if Rails::VERSION::MINOR >= 1
          copy_file "#{source_assets_base_path}gmaps4rails.base.js.coffee",       "#{destination_assets_base_path}gmaps4rails.base.js.coffee"
          copy_file "#{source_assets_base_path}gmaps4rails.googlemaps.js.coffee", "#{destination_assets_base_path}gmaps4rails.googlemaps.js.coffee"
          copy_file "#{source_assets_base_path}gmaps4rails.openlayers.js.coffee", "#{destination_assets_base_path}gmaps4rails.openlayers.js.coffee"
          copy_file "#{source_assets_base_path}gmaps4rails.bing.js.coffee",       "#{destination_assets_base_path}gmaps4rails.bing.js.coffee"
          copy_file "#{source_assets_base_path}gmaps4rails.mapquest.js.coffee",   "#{destination_assets_base_path}gmaps4rails.mapquest.js.coffee"        
          copy_file "../../../public/stylesheets/gmaps4rails.css", "app/assets/stylesheets/gmaps4rails.css"
        else
        #I don't copy manifests, kind of useless
          copy_file "#{source_js_base_path}gmaps4rails.base.js",       "#{destination_js_base_path}gmaps4rails.base.js"
          copy_file "#{source_js_base_path}gmaps4rails.googlemaps.js", "#{destination_js_base_path}gmaps4rails.googlemaps.js"
          copy_file "#{source_js_base_path}gmaps4rails.bing.js",       "#{destination_js_base_path}gmaps4rails.bing.js"
          copy_file "#{source_js_base_path}gmaps4rails.openlayers.js", "#{destination_js_base_path}gmaps4rails.openlayers.js"
          copy_file "#{source_js_base_path}gmaps4rails.mapquest.js",   "#{destination_js_base_path}gmaps4rails.mapquest.js"
          copy_file "../../../public/stylesheets/gmaps4rails.css",     "public/stylesheets/gmaps4rails.css"
        end
      end

      def copy_views
        return unless copy_views?
        copy_file File.join(source_views_path, "_gmaps4rails_libs.html.erb"), File.join(destination_views_path, "_gmaps4rails_lib.html.erb")
        copy_file File.join(source_views_path, "_gmaps4rails.html.erb"), File.join(destination_views_path, "_gmaps4rails.html.erb")
      end

      protected

      def copy_views?
        options[:views]
      end

      def source_views_path
        '../../../app/views/gmaps4rails'
      end

      def destination_views_path
        'app/views/gmaps4rails'
      end

      
      def source_assets_base_path
        '../../../app/assets/javascripts/gmaps4rails/'
      end
      
      def destination_assets_base_path
        'app/assets/javascripts/gmaps4rails/'
      end
      
      def source_js_base_path
        "../../../public/javascripts/gmaps4rails/"
      end
      
      def destination_js_base_path
        "public/javascripts/gmaps4rails/"
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end
    end
  end
end
