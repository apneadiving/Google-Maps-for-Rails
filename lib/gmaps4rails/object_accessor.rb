module Gmaps4rails  
  module ObjectAccessor
    def obj_set name, value
      object.send("#{name}=", value)
    end

    def obj_option name
      object.gmaps4rails_options[name]
    end

    def opt_value name
      object.send(obj_option name)
    end

    def obj_value name
      object.send(name)
    end

    def obj_method? name
      object.respond_to?
    end        
  end
end