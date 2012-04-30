module Gmaps4rails
  module ActsAsGmappable
    
    def self.included base
      base.send :include, InstanceMethods
      base.send :extend, ClassMethods
    end
    
    module InstanceMethods
      
      # This is a validation method which triggers the geocoding and save its results
      def process_geocoding
        #to prevent geocoding each time a save is made
        return true if gmaps4rails_prevent_geocoding?
        begin
          coordinates = Gmaps4rails.geocode(self.send(gmaps4rails_options[:address]), gmaps4rails_options[:language], false, gmaps4rails_options[:protocol])
        rescue GeocodeStatus, GeocodeInvalidQuery => e  #address was invalid, add error to address.
          Rails.logger.warn(e)
          errors[gmaps4rails_options[:address]] << gmaps4rails_options[:msg] if Gmaps4rails.condition_eval(self, gmaps4rails_options[:validation])
        rescue GeocodeNetStatus => e                    #connection error, No need to prevent save.
          Rails.logger.warn(e)
        else #if no exception, save the values
          self.gmaps4rails_save_data(coordinates)
        end
      end
      
      # saves coordinates according to the various options
      def gmaps4rails_save_data(coordinates)
        self.send("#{gmaps4rails_options[:lng_column]}=", coordinates.first[:lng])
        self.send("#{gmaps4rails_options[:lat_column]}=", coordinates.first[:lat])
        # save normalized address if required
        self.send("#{gmaps4rails_options[:normalized_address]}=", coordinates.first[:matched_address]) unless gmaps4rails_options[:normalized_address].nil?          
        # Call the callback method to let the user do what he wants with the data
        self.send(gmaps4rails_options[:callback], coordinates.first[:full_data]) unless gmaps4rails_options[:callback].nil?
        # update checker if required
        self.send("#{gmaps4rails_options[:checker]}=", true) if gmaps4rails_check_geocoding?
      end
      
      # if process_geocoding is a TrueClass or a FalseClass, 'check_process' and 'checker' play an additional role
      # if process_geocoding is a Proc or a Symbol, 'check_process' and 'checker' are skipped since process_geocoding bears the whole logic
      def gmaps4rails_prevent_geocoding?
        if gmaps4rails_options[:process_geocoding].is_a?(TrueClass) || gmaps4rails_options[:process_geocoding].is_a?(FalseClass)
          return true if !Gmaps4rails.condition_eval(self, gmaps4rails_options[:process_geocoding])
          Gmaps4rails.condition_eval(self, gmaps4rails_options[:check_process]) && self.send("#{gmaps4rails_options[:checker]}") == true 
        else
          !Gmaps4rails.condition_eval(self, gmaps4rails_options[:process_geocoding])
        end
      end
      
      # Do we have to check the geocoding 
      def gmaps4rails_check_geocoding?
        if gmaps4rails_options[:process_geocoding].is_a?(TrueClass) || gmaps4rails_options[:process_geocoding].is_a?(FalseClass)
          Gmaps4rails.condition_eval(self, gmaps4rails_options[:check_process])
        else
          false
        end
      end
      
      # creates json for one instance 
      def to_gmaps4rails(&block)
        json = "["
        object_json = Gmaps4rails.create_json(self, &block)
        json << object_json.to_s unless json.nil?
        json << "]"
      end

    end

    module ClassMethods

      def acts_as_gmappable args = {}    
        
        validate :process_geocoding
        
        #instance method containing all the options to configure the behaviour of the gem regarding the current Model
        define_method "gmaps4rails_options" do
          {
            :process_geocoding  => args[:process_geocoding].nil? ?  true : args[:process_geocoding],
            :check_process      => args[:check_process].nil?     ?  true : args[:check_process],
            :checker            => args[:checker]                || "gmaps",
                                                                 
            :lat_column         => args[:lat]                    || "latitude",
            :lng_column         => args[:lng]                    || "longitude",
                                                                 
            :msg                => args[:msg]                    || "Address invalid",
            :validation         => args[:validation].nil?        ?   true  : args[:validation],
                                                                                                                                 
            :language           => args[:language]               || "en",
            :protocol           => args[:protocol]               || "http",
            
            :address            => args[:address]                || "gmaps4rails_address",
            :callback           => args[:callback],
            :normalized_address => args[:normalized_address]
          }
        end
        
      end
    end

  end #ActsAsGmappable
end