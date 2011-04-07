module ApplicationHelper
  
  def gmaps4rails(builder, enable_css = true, enable_js = true )
    options = {
      "map_options" => { "auto_adjust" => true},
      "markers"     => { "data" => builder }
    }
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options, :enable_css => enable_css, :enable_js => enable_js }
  end
  
  def gmaps(options, enable_css = true, enable_js = true )
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options, :enable_css => enable_css, :enable_js => enable_js }
  end

end