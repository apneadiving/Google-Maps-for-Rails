class User < ActiveRecord::Base
   
  acts_as_gmappable  
  
  def gmaps4rails_address
    sec_address
  end
  
  # def gmaps4rails_marker_picture
  #   {
  #   "picture" => "http://www.blankdots.com/img/github-32x32.png",
  #   "width" => "32",
  #   "height" => "32",
  #   }
  # end
  # 
  # def gmaps4rails_title
  #   "Sweet Title"
  # end
  # 
  # def gmaps4rails_sidebar
  #   "<b>#{name}</b>"
  # end
  #  
 # def gmaps4rails_infowindow
 #   "<b>je suis l'infowindow de <h1>#{name}</h1></b>"
 # end

end
