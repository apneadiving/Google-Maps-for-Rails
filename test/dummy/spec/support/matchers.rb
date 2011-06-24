require 'rspec/expectations'

RSpec::Matchers.define :have_same_position_as do |position_hash|
  match do |object|
    object.latitude == position_hash[:latitude] && object.longitude == position_hash[:longitude]
  end
end