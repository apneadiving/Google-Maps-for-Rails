module Gmaps4rails
  module Generators
    class CopyCoffeeGenerator < ::Rails::Generators::Base

      desc "This generator copies coffee files to app/assets/javascripts"
      source_root      File.expand_path('../../../../vendor/assets/javascripts', __FILE__)

      def copy_coffee
        say_status("copying", "coffee files", :green)
        directory 'gmaps', 'app/assets/javascripts/gmaps'
      end
    end
  end
end
