class User < ActiveRecord::Base
  acts_as_gmappable :check_process => false

  def gmaps4rails_address
    address
  end
 
end
