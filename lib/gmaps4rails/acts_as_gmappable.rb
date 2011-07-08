module Gmaps4rails
  module ActsAsGmappable

    extend ActiveSupport::Concern

    module InstanceMethods
      
      # This is a before_filter to trigger the geocoding and save its results

      def process_geocoding
        #to prevent geocoding each time a save is made
        return true if gmaps4rails_options[:check_process] == true && self.send(gmaps4rails_options[:checker]) == true
        #try to geocode
        begin
          coordinates = Gmaps4rails.geocode(self.send(gmaps4rails_options[:address]), gmaps4rails_options[:language])
        rescue GeocodeStatus, GeocodeInvalidQuery  #address was invalid, add error to base.
          errors[gmaps4rails_options[:address]] << gmaps4rails_options[:msg] if gmaps4rails_options[:validation]
        rescue GeocodeNetStatus => e #connection error, No need to prevent save.
          logger.warn(e)
          #TODO add customization here?
        else #if no exception, save the values
          self.send(gmaps4rails_options[:lng_column]+"=", coordinates.first[:lng]) if self.respond_to?(gmaps4rails_options[:lng_column]+"=")
          self.send(gmaps4rails_options[:lat_column]+"=", coordinates.first[:lat]) if self.respond_to?(gmaps4rails_options[:lat_column]+"=")
          unless gmaps4rails_options[:normalized_address].nil?
            self.send(gmaps4rails_options[:normalized_address].to_s+"=", coordinates.first[:matched_address])
          end
          # Call the callback method to let the user do what he wants with the data
          self.send(gmaps4rails_options[:callback], coordinates.first[:full_data]) unless gmaps4rails_options[:callback].nil?
          if gmaps4rails_options[:check_process] == true
            self[gmaps4rails_options[:checker]] = true
          end
        end
      end

      def to_gmaps4rails(&block)
        json = "["
        json += Gmaps4rails.create_json(self, &block).to_s.chop.chop #removes the extra comma
        json += "]"
      end

    end

    module ClassMethods

      def acts_as_gmappable args = {}    
        
        # disable before_filter if explicitly set
              
        unless args[:process_geocoding] == false
          validate :process_geocoding
        end

        #instance method containing all the options to configure the behaviour of the gem regarding the current Model
        
        define_method "gmaps4rails_options" do
          {
            :lat_column         => args[:lat]                    || "latitude",
            :lng_column         => args[:lng]                    || "longitude",
            :check_process      => args[:check_process].nil?     ?   true : args[:check_process],
            :checker            => args[:checker]                || "gmaps",
            :msg                => args[:msg]                    || "Address invalid",
            :validation         => args[:validation].nil?        ?   true  : args[:validation],
            :normalized_address => args[:normalized_address],
            :address            => args[:address]                || "gmaps4rails_address",
            :callback           => args[:callback],
            :language           => args[:language]               || "en"
          }
        end

        include InstanceMethods

      end
    end

  end #ActsAsGmappable
end

ActiveSupport.on_load(:active_record) do
  ActiveRecord::Base.send(:include, Gmaps4rails::ActsAsGmappable)
end

#::ActiveRecord::Base.send :include, Gmaps4rails::ActsAsGmappable
# Mongoid::Document::ClassMethods.class_eval do
#   include Gmaps4rails::ActsAsGmappable::Base
# end