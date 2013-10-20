require 'rubygems'

ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../dummy/config/environment", __FILE__)
require 'rspec/rails'
require 'pry'

Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each   {|f| require f }

RSpec.configure do |config|
  config.treat_symbols_as_metadata_keys_with_true_values = true
  config.filter_run :focus => true
  config.run_all_when_everything_filtered = true

  config.use_transactional_fixtures = true
  config.infer_base_class_for_anonymous_controllers = false

  config.before(:suite) do
    File.open("#{Rails.root}/log/test.log", 'w') {|file| file.truncate(0) } #cleans the log file to make it readable and control it's size
  end
end

