class User < ActiveRecord::Base
  acts_as_gmappable
  
  def gmaps4rails_address
    address
  end
  
  def gmaps4rails_infowindow
    "My Beautiful Name: #{name}"
  end
  
  def gmaps4rails_marker_picture
    {
    "picture" => "http://www.blankdots.com/img/github-32x32.png",
    "width" => "32",
    "height" => "32"
    }
  end
  
  def gmaps4rails_title
    "Sweet Title"
  end
  
  def gmaps4rails_sidebar
    "sidebar content"
  end
  # def gmaps4rails_sidebar
  #   "<b>#{name}</b>"
  # end
  #  
  # def gmaps4rails_infowindow
  #   "je suis l'infowindow de #{name}"
  # end

end
