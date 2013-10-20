#!/usr/bin/env ruby
require 'sprockets'

app_path = File.expand_path('../..',  __FILE__)

source_path      = (app_path + "/vendor/assets/javascripts/gmaps/")
destination_path = (app_path + "/js_compilation/")

%w(google).each do |name|
  #main source file:
  main_source_file_name = "#{name}.coffee"
  #desired output file
  compiled_file_path = (destination_path + "gmaps_#{name}.js")

  env = Sprockets::Environment.new
  env.append_path source_path

  open(compiled_file_path, "w").write( env[main_source_file_name] )
end
