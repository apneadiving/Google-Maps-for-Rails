module ApplicationHelper
  
  def gmaps4rails(builder, enable_css = true )
    options = {
      "map_options" => { "auto_adjust" => true},
      "markers"     => { "data" => builder }
    }
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options, :enable_css => enable_css }
  end
  
  def gmaps(options, enable_css = true )
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options, :enable_css => enable_css }
  end

end