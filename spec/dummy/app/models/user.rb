class User < ActiveRecord::Base
  acts_as_gmappable
  
  attr_accessor :lat_test, :long_test, :bool_test
  
  def gmaps4rails_address
    address
  end
end
