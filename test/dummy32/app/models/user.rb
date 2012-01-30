class User < ActiveRecord::Base

  acts_as_gmappable :checker => :check_me_bitch
  
  attr_accessor :check_me_bitch
  
  def gmaps4rails_address
    address
  end
  
  
end
