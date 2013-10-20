module Gmaps4rails
  module Generators
    class CopyJsGenerator < ::Rails::Generators::Base

      desc "This generator copies js files to public/javascripts"
      source_root File.expand_path('../../../../js_compilation', __FILE__)

      def copy_js
        say_status("copying", "js file", :green)
        copy_file "gmaps_google.js", "public/javascripts/gmaps_google.js"
      end

    end
  end
end
