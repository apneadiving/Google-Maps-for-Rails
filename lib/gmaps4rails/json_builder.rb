module Gmaps4rails  
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
    attr_reader :object, :json_hash, :custom_json
    
    def initialize(object)
      @object, @json_hash, @custom_json = object, Hash.new, nil
    end
    
    def process(&block)
      if position_validator.valid?
        handle_block(&block) if block_given?
        handle_model_methods
        return_json
      else
        nil
      end
    end
    
    def infowindow(string)
      json_hash[:description] = string
      true
    end

    def title(string)
      json_hash[:title] = string
      true
    end

    def sidebar(string)
      json_hash[:sidebar] = string
      true
    end

    def json(json)
      return json_merge! json if json.is_a? Hash
      true
    end

    def picture(hash)
      json_merge! hash
      true
    end

    private

    include Gmaps4rails::ObjectAccessor

    def model_attributes
      { 
        :description    => :gmaps4rails_infowindow,
        :title          => :gmaps4rails_title,
        :sidebar        => :gmaps4rails_sidebar,
        :marker_picture => :gmaps4rails_marker_picture,
      }.merge(position_attributes)
    end

    def position_attributes
      obj_option(:position) ? {:position => opt_value(:position)} : {:lat => opt_option(:lat_column), :lng => opt_option(:lng_column)}
    end

    def json_merge! hash
      json_hash.merge! hash
    end

    def json_key? name
      json_hash.has_key? name.to_sym
    end

    def handle_model_methods
      model_attributes.each do |json_name, method_name|
        if obj_method? method_name
          if json_name == :marker_picture
            json_merge!(obj_value(method_name)) unless json_key? "picture"
          elsif json_name == :position
            json_merge!(:lat => obj_value(method_name)[0], :lng => obj_value(method_name)[1])
          else
            json_hash[json_name] = obj_value(method_name) unless json_key? json_name
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
      return json_hash.to_json if custom_json.nil?
      case custom_json
      when Hash
        json_merge! custom_json
        return json_hash.to_json
      when String
        output = json_hash.to_json
        return output.insert(1, @custom_json + ",")
      end
    end

    def handle_block(&block)
      block_result = yield(@object, self)
      @custom_json = block_result unless block_result == true
    end    

    def position_validator
      @position_validator ||= PositionValidator.new object
    end

    class PositionValidator
      attr_reader :object

      def initialize object
        @object = object
      end

      def valid?
        obj_lat_lng? || obj_position?
      end

      private

      def obj_lat_lng?
        !obj_value(:lat_column).blank? && !obj_value(:lng_column).blank?
      end

      def obj_position?
        !obj_value(:position).blank?
      end
    end

  end  
  
end