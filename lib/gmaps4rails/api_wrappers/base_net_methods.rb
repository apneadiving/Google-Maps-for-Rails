module Gmaps4rails
  
  module BaseNetMethods

    def checked_google_response(&block)
      raise_net_status unless valid_response?
  
      raise_query_error unless valid_parsed_response?
  
      yield
    end

    def base_url
      URI.escape base_request
    end

    def response
      @response ||= get_response
    end

    def valid_response?
      response.is_a?(Net::HTTPSuccess)
    end

    def valid_parsed_response?
      parsed_response["status"] == "OK"
    end

    def parsed_response
      @parsed_response ||= JSON.parse(response.body)
    end
    
    def get_response
      url = URI.parse(base_url)
      http = Gmaps4rails.http_agent
      http.get_response(url)
    end
    
  end
end