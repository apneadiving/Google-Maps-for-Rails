require 'rubygems'
require 'spork'

Spork.prefork do
  ENV["RAILS_ENV"] ||= 'test'
  require File.expand_path("../dummy/config/environment", __FILE__)
  require 'rspec/rails'
  require 'pry'
  #require 'capybara/rspec'
  require 'factory_girl_rails'
  require 'database_cleaner'
  require "jasmine"
  require 'webmock/rspec'
  
 Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each   {|f| require f }
 FactoryGirl.definition_file_paths = [ File.join(Rails.root, '../factories') ]
 
  RSpec.configure do |config|
    config.treat_symbols_as_metadata_keys_with_true_values = true
    config.filter_run :focus => true
    config.run_all_when_everything_filtered = true
 
    config.use_transactional_fixtures = true
    config.infer_base_class_for_anonymous_controllers = false
        
    config.before(:suite) do
      DatabaseCleaner.strategy = :truncation
    end
    
    config.before(:each) do
      DatabaseCleaner.start
      DatabaseCleaner.clean
    end
    
    config.after(:each) do
      DatabaseCleaner.clean
    end
  end
end

Spork.each_run do
 FactoryGirl.reload
 File.open("#{Rails.root}/log/test.log", 'w') {|file| file.truncate(0) } #cleans the log file to make it readable and control it's size
end