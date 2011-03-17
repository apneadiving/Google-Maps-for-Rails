class User < ActiveRecord::Base
  acts_as_gmappable
  
  def gmaps4rails_address
    address
  end
 
end
