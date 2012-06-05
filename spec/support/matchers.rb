require 'rspec/expectations'

def has_same_content_as?(actual, expected)
  case actual
  when Array
    case expected
    when Array
      result = true
      case actual.first
      when Array
        actual.each do |actual_subarray|
          bool = false
          expected.each do |expected_subarray|
            bool = bool || has_same_content_as?(actual_subarray, expected_subarray)
          end
          result = result && bool
        end
        result
      else
        (actual - expected).empty?
      end
    else 
      false
    end
  else
    false
  end
end

module PositionMatcherHelper
  def self.same_pos? object, position_hash
    lat_lng_arr = extract_lat_lng_arr object
    same_lat?(lat_lng_arr[0], position_hash) && same_lng?(lat_lng_arr[1], position_hash)
  end

  def self.extract_lat_lng_arr object
    if object.gmaps4rails_options[:lat_lng_array]
      object.send(object.gmaps4rails_options[:lat_lng_array]
    else
      [
        object.send(object.gmaps4rails_options[:lat_column], 
        object.send(object.gmaps4rails_options[:lng_column]
      ]
    end
  end    

  def self.same_lat? lat, position_hash
    lat == position_hash[:latitude]
  end

  def self.same_lng? lng, position_hash
    lng == position_hash[:longitude]
  end
end

RSpec::Matchers.define :have_same_position_as do |position_hash|
  match do |object|
    PositionMatcherHelper.same_pos? object, position_hash    
  end
end

RSpec::Matchers.define :be_same_json_as do |expected|
  match do |actual|
    has_same_content_as?(JSON.parse(actual), JSON.parse(expected))
  end
  failure_message_for_should do |actual|
    "Both object don't have the same content. Beware though, be sure to compare only arrays."
  end
end