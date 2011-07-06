class Hash
  
  # this method extracts all info from the hash to create javascript
  # this javascript is then rendered raw to the view so it can be interpreted and executed
  
  def to_gmaps4rails(init = false)
    #the variable 'options' must have the following structure
    #{  
    #   "map_options" => hash,
    #   "markers"     => { "data" => json, "options" => hash },
    #   "polylines"   => { "data" => json, "options" => hash },
    #   "polygons"    => { "data" => json, "options" => hash },
    #   "circles"     => { "data" => json, "options" => hash },
    #   "direction"   => { "data" => hash, "options" => hash }
    #}
    # "map_options" and "direction" must be treated separately because there content is slightly different from the others:
    # - "map_options" has no data
    # - "direction" has a hash as a data and waypoints options must be processed properly
    # 
    # in the following code, I loop through the elements of the hash
    #
    result = Array.new
    
    #Don't display js concerning map if no need to be initialized
    if init == true
      #because map should be initialized first, we must extract possible map_options
      unless self["map_options"].nil?
        self["map_options"].each do |option_k, option_v|
          if option_k == "bounds" #particular case
            result << "Gmaps4Rails.map_options.#{option_k} = #{option_v};"
          else
            result << "Gmaps4Rails.map_options.#{option_k} = #{Gmaps4rails.filter option_v};"
          end
        end
      end

      result << "Gmaps4Rails.initialize();"
    end #if init
    each do |category, content| #loop through options hash
      case category
      when "map_options"
        #already taken into account above => nothing to do here
      when "direction"
        result <<  "Gmaps4Rails.direction_conf.origin = '#{content["data"]["from"]}';"
        result << "Gmaps4Rails.direction_conf.destination = '#{content["data"]["to"]}';"

        content["options"] ||= Array.new 
    	  content["options"].each do |option_k, option_v| 
          if option_k == "waypoints"
            waypoints = Array.new
            option_v.each do |waypoint|
              waypoints << { "location" => waypoint, "stopover" => true }.to_json
            end
            result << "Gmaps4Rails.direction_conf.waypoints = [#{waypoints * (",")}];"
          else #option_k != "waypoint"
            result << "Gmaps4Rails.direction_conf.#{option_k} = #{Gmaps4rails.filter option_v};"	
          end
        end #end .each
        result << "Gmaps4Rails.create_direction();"
      else #default behaviour in case condition
        result << "Gmaps4Rails.#{category} = #{content["data"]};"
        content["options"] ||= Array.new 
        content["options"].each do |option_k, option_v|
          result << "Gmaps4Rails.#{category}_conf.#{option_k} = #{Gmaps4rails.filter option_v};"		
        end
        result << "Gmaps4Rails.create_#{category}();"
      end 
    end
    result << "Gmaps4Rails.callback();"
    result * ('
')
  end
end