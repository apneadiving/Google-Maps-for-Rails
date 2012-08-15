module Gmaps4rails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a Gmaps4rails initializer and copies the assets to the public folder.'

      def copy_locale
        if false #Rails::VERSION::MINOR >= 1
          directory assets_source_path, assets_destination_path
          copy_file "../../../public/stylesheets/gmaps4rails.css", "app/assets/stylesheets/gmaps4rails.css"
        else
          %w( base google openlayers all ).each do |filename|
            copy_file js_source_path(filename), js_destination_path(filename)
          end
          copy_file "../../../public/stylesheets/gmaps4rails.css", "public/stylesheets/gmaps4rails.css"
        end
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end

      private

      def assets_source_path
        '../../../vendor/assets/javascripts/gmaps4rails/'
      end
      
      def assets_destination_path
        'app/assets/javascripts/gmaps4rails'
      end
      
      def js_source_path(filename)
        "../../../public/javascripts/gmaps4rails/#{filename}.js"
      end
      
      def js_destination_path(filename)
        "public/javascripts/gmaps4rails/#{filename}.js"
      end
    end
  end
end
