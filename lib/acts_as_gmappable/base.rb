require 'net/http'
require 'uri'
require 'crack'

module Gmaps4rails
  
  def Gmaps4rails.create_json(object)
   	"{\"description\": \"#{object.gmaps4rails_infowindow}\",
     \"longitude\": \"#{object.gmaps4rails_longitude}\",
     \"latitude\": \"#{object.gmaps4rails_latitude}\",
     \"picture\": \"#{object.gmaps4rails_marker_picture['picture']}\",
     \"width\": \"#{object.gmaps4rails_marker_picture['width']}\",
     \"height\": \"#{object.gmaps4rails_marker_picture['height']}\"
    }"
  end
  
  module ActsAsGmappable

    module Base
      def self.included(klass)
        klass.class_eval do
          extend Config
        end
      end
      
      module Config
        def acts_as_gmappable options = {}
          before_save :get_coordinates
          include Gmaps4rails::ActsAsGmappable::Base::InstanceMethods
        end
      end
      
      module InstanceMethods
        
        def gmaps4rails_infowindow
    			self.gmaps4rails_picture.blank? ? "" :  "<img width='40' heigth='40' src='" + self.gmaps4rails_picture + "'>"
        end
        
        def gmaps4rails_picture
          ""
        end
        
        def gmaps4rails_marker_picture
          {
            "picture" => "",
            "width" => "",
            "height" => ""
          }
        end
        
        def self.gmaps4rails_trusted_scopes
          []
        end
        
        def to_gmaps4rails
          json = "["
          if (!(self.gmaps4rails_latitude == "" || self.gmaps4rails_longitude == ""))
           	json += Gmaps4rails.create_json(self)
            json += "," 
          end
          json.chop!
          json += "]"
        end
 
        def get_coordinates
         if self.gmaps4rails_address.nil? || self.gmaps4rails_address.empty?
           self.gmaps = false
         else
           geocoder = "http://maps.googleapis.com/maps/api/geocode/json?address="
           output = "&sensor=false"
           #send request to the google api to get the lat/lng
           request = geocoder + self.gmaps4rails_address + output
           url = URI.escape(request)
           resp = Net::HTTP.get_response(URI.parse(url))
           #parse result if result received properly
           if resp.inspect.include?('HTTPOK 200 OK')
             #parse the json
             parse = Crack::JSON.parse(resp.body)
             #check if google went well
             if parse["status"] == "OK"
               #TODO maybe handle case when there are many results
               #TODO store the country name and maybe other details?
               self.gmaps4rails_latitude = parse["results"].first["geometry"]["location"]["lat"]
               self.gmaps4rails_longitude = parse["results"].first["geometry"]["location"]["lng"]
               #saves a boolean to remind the status
               self.gmaps = true
             end
           else
             self.gmaps = false
           end
         end
         return true
        end
      end # InstanceMethods      
    end
  end
end

::ActiveRecord::Base.send :include, Gmaps4rails::ActsAsGmappable::Base
