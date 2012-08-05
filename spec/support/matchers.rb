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

class PositionMatcher
  attr_reader :object, :position_hash

  def initialize object, position_hash
    @object = object
    @position_hash = position_hash    
  end

  def same_pos?    
    same?(:latitude, position[0]) && same?(:longitude, position[1])
  end

  protected

  include Gmaps4rails::ObjectAccessor

  def position 
    @position = obj_option(:position) ? opt_value(:position) : obj_create_position
  end

  def obj_create_position
    [obj_coord(:lat), obj_coord(:lng)]
  end

  def obj_coord name
    obj_value :"#{name}_column"
  end

  def same? name, value
    value == position_hash[name.to_sym]
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