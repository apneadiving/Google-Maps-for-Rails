class User < ActiveRecord::Base
  acts_as_gmappable :address => :address
  
  attr_accessor :lat_test, :long_test, :bool_test
  
  after_initialize :set_lat_test
  
  def set_lat_test
    self.lat_test = address 
  end
  
end
