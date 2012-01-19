module Gmaps4rails
  
  DEFAULT_MAP_ID     = "map"
  
  def Gmaps4rails.js_function_name(hash)
    "load_" + Gmaps4rails.get_map_id(hash[:map_options])
  end

  def Gmaps4rails.get_map_id(hash)
    hash.nil? || hash[:id].nil? ? DEFAULT_MAP_ID : hash[:id]
  end

  def Gmaps4rails.get_constructor(hash)
    hash.nil? || hash[:provider].nil? ? "Gmaps4RailsGoogle()" : "Gmaps4Rails#{hash[:provider].capitalize}()"
  end

  def Gmaps4rails.create_map_js(map_hash, map_id)
    output = Array.new
    skipped_keys = [:class, :container_class]
    map_hash.each do |option_k, option_v|
      unless skipped_keys.include? option_k.to_sym
        case option_k.to_sym 
        when :bounds, :raw #particular case, render the content unescaped
          output << "#{map_id}.map_options.#{option_k} = #{option_v};"
        else
          output << "#{map_id}.map_options.#{option_k} = #{Gmaps4rails.filter option_v};"
        end
      end
    end
    output
  end

  def Gmaps4rails.create_general_js(hash, map_id, category)
    output = Array.new
    output << "#{map_id}.#{category} = #{hash[:data]};"
    hash[:options] ||= Array.new
    hash[:options].each do |option_k, option_v|
      if option_k.to_sym == :raw
        output << "#{map_id}.#{category}_conf.#{option_k} = #{option_v};"
      else
        output << "#{map_id}.#{category}_conf.#{option_k} = #{Gmaps4rails.filter option_v};"
      end	
    end
    output << "#{map_id}.create_#{category}();"
    output
  end

  def Gmaps4rails.create_direction_js(hash, map_id)
    output = Array.new
    output << "#{map_id}.direction_conf.origin = '#{hash["data"]["from"]}';"
    output << "#{map_id}.direction_conf.destination = '#{hash["data"]["to"]}';"
    hash[:options] ||= Array.new
	  hash[:options].each do |option_k, option_v|
      if option_k.to_sym == :waypoints
        waypoints = Array.new
        option_v.each do |waypoint|
          waypoints << { "location" => waypoint, "stopover" => true }.to_json
        end
        output << "#{map_id}.direction_conf.waypoints = [#{waypoints * (",")}];"
      else #option_k != "waypoint"
        output << "#{map_id}.direction_conf.#{option_k} = #{Gmaps4rails.filter option_v};"
      end
    end #end .each
    output << "#{map_id}.create_direction();"
    output
  end

  #the variable 'hash' must have the following structure
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
  def Gmaps4rails.create_js_from_hash(hash)
    result = Array.new
    map_id = "Gmaps." + Gmaps4rails.get_map_id(hash[:map_options])

    #means we are creating a new map
    result << "#{map_id} = new #{Gmaps4rails.get_constructor hash[:map_options] }" + ";"
    result << "Gmaps.#{Gmaps4rails.js_function_name hash } = function() {"
    result << Gmaps4rails.create_map_js(hash[:map_options], map_id) unless hash[:map_options].nil?
    result << "#{map_id}.initialize();"

    hash.each do |category, content| #loop through options hash
      skipped_categories = [:map_options, :last_map, :scripts]
      unless skipped_categories.include? category.to_sym
        if category.to_sym == :direction
          result << Gmaps4rails.create_direction_js(content, map_id)
        else  
          result << Gmaps4rails.create_general_js(content, map_id, category)
        end
      end
    end
    result << "#{map_id}.adjustMapToBounds();"
    result << "#{map_id}.callback();"

    result << "};"
    if hash[:last_map].nil? || hash[:last_map] == true
      result << "window.onload = function() { Gmaps.loadMaps(); };"
    end

    result * ('
')
  end

end
  