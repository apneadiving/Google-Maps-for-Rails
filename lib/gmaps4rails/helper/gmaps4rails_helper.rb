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
  def gmaps(options)
    options_with_indifferent_access = options.with_indifferent_access
    view_helper                     = Gmaps4rails::ViewHelper.new(options_with_indifferent_access)
    
    js_dependencies = if Gmaps4rails.escape_js_url
                        view_helper.js_dependencies_array
                      else
                        view_helper.js_dependencies_array.map(&:html_safe)
                      end

    render :partial => '/gmaps4rails/gmaps4rails', 
           :locals  => { 
             :options         => options_with_indifferent_access, 
             :js_dependencies => js_dependencies,
             :dom             => view_helper.dom_attributes
            }
  end

end
