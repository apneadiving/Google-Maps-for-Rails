require 'rspec/expectations'

RSpec::Matchers.define :have_same_position_as do |position_hash|
  match do |object|
    object.send(object.gmaps4rails_options[:lat_column]) == position_hash[:latitude] && object.send(object.gmaps4rails_options[:lng_column]) == position_hash[:longitude]
  end
end