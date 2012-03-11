module Gmaps4railsHelper

  # shortcut helper for basic marker display

  def gmaps4rails(builder, enable_css = true, enable_js = true )
    options = {
      :map_options => { :auto_adjust => true},
      :markers     => { :data => builder, :options => {:do_clustering => true} }
    }
    render :partial => '/gmaps4rails/gmaps4rails', :locals => { :options => options.with_indifferent_access, :enable_css => enable_css, :enable_js => enable_js }
  end

  # complete helper to pass all variables alongside their options

  def gmaps(options, enable_css = true, enable_js = true )
    render :partial => '/gmaps4rails/gmaps4rails', :locals => { :options => options.with_indifferent_access, :enable_css => enable_css, :enable_js => enable_js }
  end

  def gmaps4rails_js_libraries(libraries_array)
    return "" if libraries_array.nil?
    "," + libraries_array.join(",")
  end

  def gmaps4rails_map_language(map_options)
    "language=#{map_options.try(:[], :language) || ''}&hl=#{map_options.try(:[], :hl) || ''}&region=#{map_options.try(:[], :region) || ''}".html_safe
  end

  def gmaps4rails_map_id(map_options)
    map_options.try(:[], :id) || Gmaps4rails::DEFAULT_MAP_ID
  end

  def gmaps4rails_container_class(map_options)
    map_options.try(:[], :container_class) || "map_container"
  end

  def gmaps4rails_map_class(map_options)
    default_class = map_options.try(:[], :provider) == "bing" ? "bing_map" : "gmaps4rails_map"
    map_options.try(:[], :class) || default_class
  end


  def gmaps4rails_js_files(map_options = nil, scripts = nil, enable_js = true, marker_options = nil)
    render "/gmaps4rails/scripts", :map_options => map_options, :scripts => scripts, :enable_js => enable_js, :marker_options => marker_options
  end

  def gmaps4rails_html(map_options = nil)
    render "/gmaps4rails/html", :map_options => map_options
  end
  
  def gmaps4rails_pipeline_enabled?
    Rails.configuration.methods.include?(:assets) && Rails.configuration.assets.enabled
  end
end
