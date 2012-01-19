module Gmaps4railsHelper
  
  # shortcut helper for basic marker display
  
  def gmaps4rails(builder, enable_css = true, enable_js = true )
    options = {
      :map_options => { :auto_adjust => true},
      :markers     => { :data => builder, :options => {:do_clustering => true} }
    }
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options.with_indifferent_access, :enable_css => enable_css, :enable_js => enable_js }
  end
  
  # complete helper to pass all variables alongside their options
  
  def gmaps(options, enable_css = true, enable_js = true )
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :options => options.with_indifferent_access, :enable_css => enable_css, :enable_js => enable_js }
  end
  
  def gmaps4rails_js_libraries(libraries_array)
    return "" if libraries_array.nil?
    "," + libraries_array.join(",")
  end
  
  def gmaps4rails_map_id(options)
    options[:map_options].try(:[], :id) || Gmaps4rails::DEFAULT_MAP_ID
  end
  
  def gmaps4rails_container_class(options)
    options[:map_options].try(:[], :container_class) || "map_container"
  end
  
  def gmaps4rails_map_class(options)
    default_class = options[:map_options].try(:[], :provider) == "bing" ? "bing_map" : "gmaps4rails_map"
    options[:map_options].try(:[], :class) || default_class
  end
  
  def gmaps4rails_js_files(options, enable_js)
    render "gmaps4rails/scripts", :options => options, :enable_js => enable_js
  end
  
  def gmaps4rails_html(options)
    render "gmaps4rails/html", :options => options
  end
end