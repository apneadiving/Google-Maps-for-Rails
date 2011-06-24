require 'rspec/expectations'

RSpec::Matchers.define :have_same_position_as do |position_hash|
  match do |model|
    model.latitude == position_hash[:latitude] && model.longitude == position_hash[:longitude]
  end
end