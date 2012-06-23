class Place
  acts_as_gmappable :address => :address
  
  attr_accessor :location, :bool_test  
end
