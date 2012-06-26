module Enumerable
  #Scopes on models generate Arrays
  #this method enables short call to the json creation for all elements in the array
  def to_gmaps4rails(&block)
    output = "["
    json_array = []
    each do |object|
      json = Gmaps4rails.create_json(object, &block)
      json_array << json.to_s unless json.nil?
    end
    output << json_array * (",")
    output << "]"
  end
end