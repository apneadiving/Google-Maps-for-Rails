if RUBY_VERSION == "1.9.3"
  
  require 'mongoid'

  class GeoPlace  
    include Mongoid::Document
    include Gmaps4rails::ActsAsGmappable

    # Array position format in the form: [lng, lat]
    # This format is f.ex used by *geocoder* gem
    acts_as_gmappable :address => :address, :position => :pos, :pos_order => [:lng, :lat]
    
    field :pos,      :type => Array
    field :address,  :type => String
    field :gmaps,    :type => Boolean
  end

end