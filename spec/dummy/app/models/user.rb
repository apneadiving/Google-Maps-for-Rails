class User < ActiveRecord::Base
  acts_as_gmappable :address => :address
  
  attr_accessor :lat_test, :long_test, :bool_test
  
end
