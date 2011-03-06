class Array
  def to_gmaps4rails
    json = "["
    each do |object|
      json += Gmaps4rails.create_json(object).to_s
    end
    json.chop! unless json == "["
    json += "]"
  end
end