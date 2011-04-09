class User < ActiveRecord::Base
  acts_as_gmappable
  
  def gmaps4rails_address
    address
  end
  
  # def gmaps4rails_sidebar
  #   "<b>#{name}</b>"
  # end
  #  
  def gmaps4rails_infowindow
    "je suis l'infowindow de #{name}"
  end

end
