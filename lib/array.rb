class Array
  def to_gmaps4rails
    json = "["
    each do |object|
      if (!(object.gmaps4rails_latitude == "" || object.gmaps4rails_longitude == ""))
        json += Gmaps4rails.create_json(object)
        json += "," 
      end
    end
    json.chop!
    json += "]"
  end
end