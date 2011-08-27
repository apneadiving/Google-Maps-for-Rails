class Hash
  
  # this method extracts all info from the hash to create javascript
  # this javascript is then rendered raw to the view so it can be interpreted and executed
  def to_gmaps4rails(edit_map_with_id = false)
    Gmaps4rails.create_js_from_hash(self.with_indifferent_access, edit_map_with_id)
  end
  
end