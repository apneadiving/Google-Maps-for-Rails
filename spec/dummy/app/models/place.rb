if RUBY_VERSION == "2.0.0"

  require 'mongoid'

  class Place
    include Mongoid::Document

    field :pos,      :type => Array
    field :address,  :type => String
    field :gmaps,    :type => Boolean
  end

end
