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
    
    if include_gmaps4rails_api_in_header?
      js_dependencies = []
    else
      js_dependencies = if Gmaps4rails.escape_js_url
                          view_helper.js_dependencies_array
                        else
                          view_helper.js_dependencies_array.map(&:html_safe)
                        end
    end
                      
    render :partial => '/gmaps4rails/gmaps4rails', 
           :locals  => { 
             :options         => options_with_indifferent_access, 
             :js_dependencies => js_dependencies,
             :dom             => view_helper.dom_attributes
            }
  end
  
  # In order to use turbolinks, one has to include the maps api on the first page to load,
  # because the api cannot be loaded dynamically by turbolinks due to the javascript 
  # same-origin policy. 
  #
  # Therefore, in order to be able to use gmaps4rails with turbolinks, one has to include
  # the api script tags in the layout file.
  #
  # For example:
  # 
  #    <!-- app/layouts/default.html.erb -->
  #    <html><head>
  #      <%= gmaps4rails_api_script_tags %>
  #      ...
  #    </head><body> 
  #      ...
  #    </body></html>
  #
  def gmaps4rails_api_script_tags(options = {})
    if include_gmaps4rails_api_in_header?
      options.merge!({ :scripts => :api })   # request only api scripts, here.
      api_urls = Gmaps4rails::ViewHelper.new(options).js_dependencies_array
      javascript_include_tag *api_urls
    end
  end
  
  # This method returns whether the gmaps api scripts should **always** be included in the 
  # html head rather than in a body script tag on demand. 
  #
  # By default, the api should be included in the header if the application uses turbolinks.
  # But the behaviour can be overridden by setting it explicitly, for example in an
  # initilizer:
  #
  #    # config/initializers/gmaps4rails.rb
  #    YourAppName::Application.config.gmaps4rails = { include_api_in_header: true }
  #
  def include_gmaps4rails_api_in_header?
    if defined?(Rails.configuration.gmaps4rails) && Rails.configuration.gmaps4rails[:include_api_in_header]
      Rails.configuration.gmaps4rails[:include_api_in_header]
    else
      defined? Turbolinks
    end
  end
  
end
