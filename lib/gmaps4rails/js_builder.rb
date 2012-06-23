module Gmaps4rails
  class JsBuilder
    
    DEFAULT_MAP_ID = "map"
    DATA_KEYS      = [:markers, :polylines, :polygons, :circles, :direction, :kml]

    #the 'option_hash' must have the following structure
    #{  
    #   :map_options => hash,
    #   :markers     => { :data => json, :options => hash },
    #   :polylines   => { :data => json, :options => hash },
    #   :polygons    => { :data => json, :options => hash },
    #   :circles     => { :data => json, :options => hash },
    #   :direction   => { :data => hash, :options => hash },
    #   :kml         => { :data => json, :options => hash }
    #}
    #should be with only symbol keys or with indifferent access    
    def initialize(option_hash)
      @js   = Array.new
      @hash = option_hash
    end

    def create_js
      @js << "#{gmap_id} = new #{ map_constructor };"
      @js << "Gmaps.#{js_function_name} = function() {"
      
      process_map_options
      
      @js << "#{gmap_id}.initialize();"

      process_data

      @js << "#{gmap_id}.adjustMapToBounds();"
      @js << "#{gmap_id}.callback();"
      @js << "};"
      @js << "Gmaps.oldOnload = window.onload;\n window.onload = function() { Gmaps.triggerOldOnload(); Gmaps.loadMaps(); };" if load_map?
      
      @js * ("\n")
    end

    def process_map_options
      return unless map_options
      map_options.each do |option_key, option_value|
        next if [:class, :container_class].include? option_key.to_sym
        case option_key.to_sym 
        when :bounds, :raw #particular case, render the content unescaped
          @js << "#{gmap_id}.map_options.#{option_key} = #{option_value};"
        else
          @js << "#{gmap_id}.map_options.#{option_key} = #{option_value.to_json};"
        end
      end
    end

    def process_data
      data.each do |name, hash|
        datum = ::Gmaps4rails::JsBuilder::Datum.new(gmap_id, name, hash)
        @js.concat datum.create_js
      end
    end
    
    def map_options
      @hash[:map_options]
    end
    
    def data
      @hash.select{|key, value| DATA_KEYS.include?(key.to_sym) }
    end
    
    def load_map?
      @hash[:last_map].nil? || @hash[:last_map] == true
    end
    
    def js_function_name
      "load_" + map_id
    end

    def gmap_id
      @gmap_id ||= "Gmaps." + map_id
    end
    
    def map_id
      @map_id ||= map_options.try(:[],:id) || DEFAULT_MAP_ID
    end
    
    def map_constructor
      map_options.try(:[],:provider) ? "Gmaps4Rails#{map_options[:provider].capitalize}()" : "Gmaps4RailsGoogle()"
    end
    
    class Datum
      # example:
      # - name: :markers
      # - hash: { :data => json, :options => hash }
      
      delegate :options, :data, :to => :@element_info
      
      def initialize(gmap_id, name, hash)
        @gmap_id, @name, @js = gmap_id, name, Array.new
        @element_info = OpenStruct.new(hash)
      end
      
      def create_js
        if @name.to_sym == :direction
          create_direction_js
        else  
          create_standard_js
        end
      end
      
      def create_standard_js
        @js << "#{@gmap_id}.#{@name} = #{data};"

        set_configuration_variables

        @js << "#{@gmap_id}.create_#{@name}();"
      end

      def create_direction_js
        @js << "#{@gmap_id}.direction_conf.origin = '#{data["from"]}';"
        @js << "#{@gmap_id}.direction_conf.destination = '#{data["to"]}';"

        set_direction_variables

        @js << "#{@gmap_id}.create_direction();"
      end

      def set_configuration_variables
        return unless options
        options.each do |option_key, option_value|
          @js << if option_key.to_sym == :raw
                   "#{@gmap_id}.#{@name}_conf.#{option_key} = #{option_value};"
                 else
                   "#{@gmap_id}.#{@name}_conf.#{option_key} = #{option_value.to_json};"
                 end	
        end
      end

      def set_direction_variables
        return unless options
        options.each do |option_key, option_value|
          if option_key.to_sym == :waypoints
            waypoints = Array.new
            option_value.each do |waypoint|
              waypoints << { "location" => waypoint, "stopover" => true }.to_json
            end
            @js << "#{@gmap_id}.direction_conf.waypoints = [#{waypoints * (",")}];"
          else
            @js << "#{@gmap_id}.direction_conf.#{option_key} = #{option_value.to_json};"
          end
        end
      end
      
    end
  end


end
  