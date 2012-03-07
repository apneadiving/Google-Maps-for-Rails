module Gmaps4rails

  mattr_accessor :json_hash, :custom_json, :object
  
  def Gmaps4rails.create_json(object, &block)
    @object, @json_hash, @custom_json = object, Hash.new, nil
    if compliant?
      handle_block(&block) if block_given?
      handle_model_methods
      return_json
    else
      nil
    end
  end
  
  def Gmaps4rails.infowindow(string)
    @json_hash[:description] = string
    true
  end
  
  def Gmaps4rails.title(string)
    @json_hash[:title] = string
    true
  end
  
  def Gmaps4rails.sidebar(string)
    @json_hash[:sidebar] = string
    true
  end
  
  def Gmaps4rails.json(json)
    return @json_hash.merge! json if json.is_a? Hash
    true
  end
  
  def Gmaps4rails.picture(hash)
    @json_hash.merge! hash
    true
  end
  
  private
  
  def Gmaps4rails.model_attributes
    { 
      :description    => :gmaps4rails_infowindow,
      :title          => :gmaps4rails_title,
      :sidebar        => :gmaps4rails_sidebar,
      :marker_picture => :gmaps4rails_marker_picture,
      :lat            => @object.gmaps4rails_options[:lat_column],
      :lng            => @object.gmaps4rails_options[:lng_column]
    }
  end
  
  def Gmaps4rails.handle_model_methods
    model_attributes.each do |json_name, method_name|
      if @object.respond_to? method_name
        if json_name == :marker_picture
          @json_hash.merge! @object.send(method_name)
        else
          @json_hash[json_name] = @object.send(method_name)
        end
      end
    end
  end
  
  # returns the proper json
  # three cases here:
  # - no custom json provided
  # - custom json provided as a hash (marker.json { :id => user.id })     => merge hashes then create json
  # - custom json provided as string (marker.json {"\"id\": #{user.id}" } => create json from hash then insert string inside
  def Gmaps4rails.return_json
    return @json_hash.to_json if @custom_json.nil?
    if @custom_json.is_a? Hash
      @json_hash.merge! @custom_json
      return @json_hash.to_json
    elsif @custom_json.is_a? String
      output = @json_hash.to_json
      return output.insert(1, @custom_json + ",")
    end
  end
  
  def Gmaps4rails.compliant?
    !(@object.send(@object.gmaps4rails_options[:lat_column]).blank? && @object.send(@object.gmaps4rails_options[:lng_column]).blank?)
  end
  
  # the to_gmaps4rails method accepts a block to customize:
  # - infowindow
  # - picture
  # - title
  # - sidebar
  # - json
  #
  # This works this way:
  #   @json = User.all.to_gmaps4rails do |user, marker|
  #     marker.infowindow render_to_string(:partial => "/users/my_template", :locals => { :object => user}).gsub(/\n/, '').gsub(/"/, '\"')
  #     marker.picture({
  #                     :picture => "http://www.blankdots.com/img/github-32x32.png",
  #                     :width   => "32",
  #                     :height  => "32"
  #                    })
  #     marker.title   "i'm the title"
  #     marker.sidebar "i'm the sidebar"
  #     marker.json({ :id => user.id })
  #   end
  #
  # For backward compability, a mere string could be passed:
  #   @json = User.all.to_gmaps4rails do |user, marker|
  #     "\"id\": #{user.id}"
  #   end
  #
  def Gmaps4rails.handle_block(&block)
    block_result = yield(@object, ::Gmaps4rails)
    @custom_json = block_result unless block_result == true
  end
  
end