module Gmaps4railsHelper

  # shortcut helper for marker display with convenient default settings
  # @params [String] builder is a json string
  def gmaps4rails(builder)
    options = {
      :map_options => { :auto_adjust => true},
      :markers     => { :data => builder, :options => {:do_clustering => true} }
    }
    gmaps(options)
  end

  # full helper to pass all variables and their options
  # @params [Hash] options is a Hash containing data and options. Example: { markers:{ data: @json, options: { do_clustering: true } } }
  def gmaps(options = {})
    gmaps_libs(options) if options[:with_libs]

    options_with_indifferent_access = options.with_indifferent_access
    view_helper                     = Gmaps4rails::ViewHelper.new(options_with_indifferent_access)
    gmaps4rails_map view_helper.dom_attributes, options_with_indifferent_access
  end

  def gmaps_libs(options = {})
    options_with_indifferent_access = options.with_indifferent_access
    view_helper                     = Gmaps4rails::ViewHelper.new(options_with_indifferent_access)
    
    js_dependencies = Gmaps4rails.escape_js_url ? view_helper.js_dependencies_array : view_helper.js_dependencies_array.map(&:html_safe)

    content_for :scripts do
      javascript_include_tag(*js_dependencies)
    end

    # render partial: '/gmaps4rails/gmaps4rails_libs', 
    #        :locals  => { 
    #          :js_dependencies => js_dependencies,
    #          :options => options_with_indifferent_access
    #        }
  end

  def gmaps_libs_now(options = {})
    options_with_indifferent_access = options.with_indifferent_access
    view_helper                     = Gmaps4rails::ViewHelper.new(options_with_indifferent_access)
    
    js_dependencies = Gmaps4rails.escape_js_url ? view_helper.js_dependencies_array : view_helper.js_dependencies_array.map(&:html_safe)

    javascript_include_tag(*js_dependencies)
  end

  protected

  def gmaps4rails_map dom, options = {}
    options.reverse_merge! :style => "width:750px; height:475px;"

    map_script << content_tag(:script, :type => "text/javascript") do
      raw(options.to_gmaps4rails).html_safe
    end

    map = case dom.map_provider.to_sym
    when :mapquest
      content_tag :div, nil, :id => dom.map_id, :style => options[:style]
    when :bing
      content_tag :div, nil, :id => dom.map_id, :class => dom.map_class
    else
      content_tag :div, :class => dom.container_class do
        content_tag :div, nil, :id => dom.map_id, :class => dom.map_class
      end
    end

    (map_script + map).html_safe
  end   
end
