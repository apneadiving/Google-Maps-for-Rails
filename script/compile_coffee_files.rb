#!/usr/bin/env ruby
require 'sprockets'

app_path = File.expand_path('../..',  __FILE__)
#folder with source files
folder_path = (app_path + "/vendor/assets/javascripts/gmaps4rails/")

#main source file:
main_source_file_name = "base.coffee"

#desired output file
compiled_file_path = (folder_path + "all.js")

env = Sprockets::Environment.new
env.append_path folder_path

open(compiled_file_path, "w").write( env[main_source_file_name] )
