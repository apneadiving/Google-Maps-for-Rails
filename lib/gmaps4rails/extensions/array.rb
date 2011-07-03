class Array
  #Scopes on models generate Arrays
  #this method enables short call to the json creation for all elements in the array
  
  def to_gmaps4rails
    json = "["
    each do |object|
      json += Gmaps4rails.create_json(object).to_s
    end
    json.chop!.chop! unless json == "["
    json += "]"
  end
end