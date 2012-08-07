require 'rspec/expectations'
require 'ostruct'

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

class PositionMatcher
  attr_reader :object, :position_hash
  delegate :position, :lat_column, :lng_column, :to => :@options

  def initialize object, position_hash
    @object, @position_hash = object, position_hash
    @options = ::OpenStruct.new object.gmaps4rails_options
  end

  def same_pos?    
    position_hash[:latitude] == lat && position_hash[:longitude] == lng
  end

  protected

  def lat
    position ? object.send("#{position}")[0] : object.send("#{lat_column}")
  end

  def lng
    position ? object.send("#{position}")[1] : object.send("#{lng_column}")
  end

end

def position_matcher object, position_hash
  PositionMatcher.new object, position_hash
end

RSpec::Matchers.define :have_same_position_as do |position_hash|
  match do |object|
    position_matcher(object, position_hash).same_pos?
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