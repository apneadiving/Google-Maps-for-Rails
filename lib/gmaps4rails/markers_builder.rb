module Gmaps4rails
  # the to_gmaps4rails method accepts a block to customize:
  # - infowindow
  # - picture
  # - shadow
  # - title
  # - sidebar
  # - json
  #
  # This works this way:
  #   @users = User.all
  #   @json  = Gmaps4rails.build_markers @users do |user, marker|
  #     marker.lat user.latitude
  #     marker.lng user.longitude
  #     marker.infowindow render_to_string(:partial => "/users/my_template", :locals => { :object => user}).gsub(/\n/, '').gsub(/"/, '\"')
  #     marker.picture({
  #                     :url    => "http://www.blankdots.com/img/github-32x32.png",
  #                     :width  => "32",
  #                     :height => "32"
  #                    })
  #     marker.title   "i'm the title"
  #     marker.json({ :id => user.id })
  #   end
  class MarkersBuilder

    def initialize(collection)
      @collection = Array(collection)
    end

    def call(&block)
      @collection.map do |object|
        MarkerBuilder.new(object).call(&block)
      end
    end

    class MarkerBuilder

      attr_reader :object, :hash
      def initialize(object)
        @object = object
        @hash   = {}
      end

      def call(&block)
        block.call(object, self)
        hash
      end

      def lat(float)
        @hash[:lat] = float
      end

      def lng(float)
        @hash[:lng] = float
      end

      def infowindow(string)
        @hash[:infowindow] = string
      end

      def title(string)
        @hash[:marker_title] = string
      end

      def json(hash)
        @hash.merge! hash
      end

      def picture(hash)
        @hash[:picture] = hash
      end

      def shadow(hash)
        @hash[:shadow] = hash
      end
    end
  end
end
