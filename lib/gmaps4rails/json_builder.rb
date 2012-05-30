module Gmaps4rails
  
  def Gmaps4rails.create_json(object, &block)
    json_handler = ::Gmaps4rails::JsonBuilder.new(object, &block)
    json_handler.process(&block)
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
  class JsonBuilder
    
    def initialize(object)
      @object, @json_hash, @custom_json = object, Hash.new, nil
    end
    
    def process(&block)
      if compliant?
        handle_block(&block) if block_given?
        handle_model_methods
        return_json
      else
        nil
      end
    end
    
    def infowindow(string)
      @json_hash[:description] = string
      true
    end

    def title(string)
      @json_hash[:title] = string
      true
    end

    def sidebar(string)
      @json_hash[:sidebar] = string
      true
    end

    def json(json)
      return @json_hash.merge! json if json.is_a? Hash
      true
    end

    def picture(hash)
      @json_hash.merge! hash
      true
    end

    private

    def model_attributes
      { 
        :description    => :gmaps4rails_infowindow,
        :title          => :gmaps4rails_title,
        :sidebar        => :gmaps4rails_sidebar,
        :marker_picture => :gmaps4rails_marker_picture,
        :lat            => @object.gmaps4rails_options[:lat_column],
        :lng            => @object.gmaps4rails_options[:lng_column]
      }
    end

    def handle_model_methods
      model_attributes.each do |json_name, method_name|
        if @object.respond_to? method_name
          if json_name == :marker_picture
            @json_hash.merge!(@object.send(method_name)) unless @json_hash.has_key? "picture"
          else
            @json_hash[json_name] = @object.send(method_name) unless @json_hash.has_key? json_name
          end
        end
      end
    end

    # returns the proper json
    # three cases here:
    # - no custom json provided
    # - custom json provided as a hash (marker.json { :id => user.id })     => merge hashes then create json
    # - custom json provided as string (marker.json {"\"id\": #{user.id}" } => create json from hash then insert string inside
    def return_json
      return @json_hash.to_json if @custom_json.nil?
      case @custom_json
      when Hash
        @json_hash.merge! @custom_json
        return @json_hash.to_json
      when String
        output = @json_hash.to_json
        return output.insert(1, @custom_json + ",")
      end
    end

    def compliant?
      !(@object.send(@object.gmaps4rails_options[:lat_column]).blank? && @object.send(@object.gmaps4rails_options[:lng_column]).blank?)
    end

    def handle_block(&block)
      block_result = yield(@object, self)
      @custom_json = block_result unless block_result == true
    end

  end  
  
end