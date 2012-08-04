module Gmaps4rails
  
  class ModelHandler
    
    attr_accessor :options, :object 
    
    delegate :process_geocoding, :check_process, :checker, :lat_column, :lng_column, :position, :msg, :validation,
             :language, :protocol, :address, :callback, :normalized_address,
             :to => :options
  
    def initialize(object, gmaps4rails_options)
      @options = ::OpenStruct.new(gmaps4rails_options)
      @object  = object
    end
    
    # saves coordinates according to the various options
    def retrieve_coordinates
      return if prevent_geocoding?
      checked_coordinates do
        position? ? set_position : set_lat_lng
        set_normalized_address if normalized_address
        # Call the callback method to let the user do what he wants with the data
        do_callback if callback
        # update checker if required
        set_checker if check_geocoding?
      end
    end
    
    private

    def do_callback
      object.send callback, coordinates.first[:full_data]
    end

    def set_checker
      obj_set checker, true
    end

    def set_normalized_address
      # save normalized address if required
      obj_set normalized_address, coordinates.first[:matched_address]
    end      

    def set_position      
      obj_set position, [coord(:lat), coord(:lng)]
    end

    def set_lat_lng
      set_coordinate :lng
      set_coordinate :lat
    end

    def set_coordinate name
      column = send("#{name}_column")
      obj_set column, coord(name)
    end

    def obj_set name, value
      object.send("#{name}=", value)
    end

    def coord name
      coordinates.first[name.to_sym]
    end

    def position?
      position
    end
    
    def checked_coordinates(&block)
      yield if coordinates
    end
    
    def coordinates
      @coordinates ||= get_coordinates
    end
    
    def get_coordinates
      Gmaps4rails.geocode(object.send(address), language, false, protocol)
    rescue GeocodeStatus, GeocodeInvalidQuery => e  #address was invalid, add error to address.
      Rails.logger.warn(e)
      object.errors[address] << msg if condition_eval(object, validation)
      false
    rescue GeocodeNetStatus => e                    #connection error, No need to prevent save.
      Rails.logger.warn(e)
      false
    end
    
    # to prevent geocoding each time a save is made
    # if process_geocoding is a TrueClass or a FalseClass, 'check_process' and 'checker' play an additional role
    # if process_geocoding is a Proc or a Symbol, 'check_process' and 'checker' are skipped since process_geocoding bears the whole logic
    def prevent_geocoding?
      if process_geocoding.is_a?(TrueClass) || process_geocoding.is_a?(FalseClass)
        return true if !condition_eval(object, process_geocoding)
        condition_eval(object, check_process) && object.send(checker)
      else
        !condition_eval(object, process_geocoding)
      end
    end
    
    # Do we have to check the geocoding 
    def check_geocoding?
      if process_geocoding.is_a?(TrueClass) || process_geocoding.is_a?(FalseClass)
        condition_eval(object, check_process)
      else
        false
      end
    end
    
    def condition_eval(*args)
      Gmaps4rails.condition_eval(*args)
    end

  end

end