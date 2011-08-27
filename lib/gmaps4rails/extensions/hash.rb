class Hash
  
  # this method extracts all info from the hash to create javascript
  # this javascript is then rendered raw to the view so it can be interpreted and executed
  
  def to_gmaps4rails(edit_map_with_id = false)
    #the variable 'options' must have the following structure
    #{  
    #   :map_options => hash,
    #   :markers     => { :data => json, :options => hash },
    #   :polylines   => { :data => json, :options => hash },
    #   :polygons    => { :data => json, :options => hash },
    #   :circles     => { :data => json, :options => hash },
    #   :direction   => { :data => hash, :options => hash },
    #   :kml         => { :data => json, :options => hash }
    #}
    # "map_options", "scripts" and "direction" must be treated separately because there content is slightly different from the others:
    # - "map_options" and "scripts" don't contain interesting data for the view
    # - "direction" has a hash as a data and waypoints options must be processed properly
    # 
    # in the following code, I loop through the elements of the hash
    #
    result = Array.new
    map_id = edit_map_with_id || "Gmaps." + Gmaps4rails.get_map_id(self[:map_options])
    
    #means we are creating a new map
    if edit_map_with_id == false 
      
      js_object_constructor = Gmaps4rails.get_constructor(self[:map_options])
      result << "#{map_id} = new #{js_object_constructor}" + ";"
      
      #extract map_options
      unless self[:map_options].nil?
        self[:map_options].each do |option_k, option_v|
          if option_k == "bounds" #particular case
            result << "#{map_id}.map_options.#{option_k} = #{option_v};"
          else
            result << "#{map_id}.map_options.#{option_k} = #{Gmaps4rails.filter option_v};"
          end
        end
      end

      result << "#{map_id}.initialize();"
    end
    
    each do |category, content| #loop through options hash
      case category
      when "map_options"
        #already taken into account above => nothing to do here
      when "scripts"
        #nothing to do 
      when "direction"
        result <<  "#{map_id}.direction_conf.origin = '#{content["data"]["from"]}';"
        result << "#{map_id}.direction_conf.destination = '#{content["data"]["to"]}';"

        content[:options] ||= Array.new 
    	  content[:options].each do |option_k, option_v| 
          if option_k == "waypoints"
            waypoints = Array.new
            option_v.each do |waypoint|
              waypoints << { "location" => waypoint, "stopover" => true }.to_json
            end
            result << "#{map_id}.direction_conf.waypoints = [#{waypoints * (",")}];"
          else #option_k != "waypoint"
            result << "#{map_id}.direction_conf.#{option_k} = #{Gmaps4rails.filter option_v};"	
          end
        end #end .each
        result << "#{map_id}.create_direction();"
      else #default behaviour in case condition
        result << "#{map_id}.#{category} = #{content[:data]};"
        content[:options] ||= Array.new 
        content[:options].each do |option_k, option_v|
          result << "#{map_id}.#{category}_conf.#{option_k} = #{Gmaps4rails.filter option_v};"		
        end
        result << "#{map_id}.create_#{category}();"
      end 
    end
    result << "#{map_id}.callback();"
    result * ('
')
  end
end