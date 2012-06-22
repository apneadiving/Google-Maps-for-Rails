module Gmaps4rails

  class Direction
    
    include BaseNetMethods
    
    attr_reader :ride, :output, :protocol, :options, :polylines, :language
    attr_accessor :legs
    
    def initialize(start_end, options= {}, output = "pretty")
      @ride = OpenStruct.new start_end
      @output    = output
      @protocol  = options.delete(:protocol) || "http"
      @language  = options.delete(:language) || "en"
      @options   = options
      raise_invalid unless valid?
      self.legs  = []
    end

    def get
      checked_google_response do
        #Each element in the legs array specifies a single leg of the journey from the origin to the destination in the calculated route
        parsed_response["routes"].first["legs"].each do |leg|
          extract_polylines(leg) if remove_polylines? 
          self.legs << {
                         "duration"  => { "text" => leg["duration"]["text"], "value" => leg["duration"]["value"].to_f },
                         "distance"  => { "text" => leg["distance"]["text"], "value" => leg["distance"]["value"].to_f },
                         "steps"     => leg["steps"]
                       }
          merge_polylines_with_leg if output == "pretty"
        end
        legs
      end
    end

    private
    
    def extract_polylines(leg)
      @polylines = leg["steps"].map {|step| step.delete("polyline")}
    end
    
    def polylines_json
      polylines.map{ |poly| {"coded_array" => poly["points"]} }.to_json
    end
    
    def remove_polylines?
      output == "pretty" || output == "clean"
    end
    
    def merge_polylines_with_leg
      self.legs.last.merge!({ "polylines" => polylines_json })
    end
    
    def format_options_for_url
      return "" if options.empty?
      "&" + options.map do |k,v| 
              if v.is_a?(Array) 
                k + "=" + v * ("|")
              else
                k + "=" + v 
              end
            end * ("&")
    end
    
    def base_request
      "#{protocol}://maps.googleapis.com/maps/api/directions/json?language=#{language}&origin=#{ride.from}&destination=#{ride.to}&sensor=false" + format_options_for_url
    end
  
    def valid?
      !(ride.from.empty? || ride.to.empty?)
    end
    
    def raise_net_status
      raise Gmaps4rails::DirectionNetStatus, "The request sent to google was invalid (not http success): #{base_request}.\nResponse was: #{response}"
    end
    
    def raise_query_error
      raise raise Gmaps4rails::DirectionStatus, "The query you passed seems invalid, status was: #{parsed_response["status"]}.\nRequest was: #{base_request}"
    end
    
    def raise_invalid
      raise Gmaps4rails::DirectionInvalidQuery, "Origin and destination must be provided in a hash as first argument"
    end
 
  end
  
end