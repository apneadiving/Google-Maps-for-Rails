require 'mongoid'

class Place  
  include Mongoid::Document
  include Gmaps4rails::ActsAsGmappable

  acts_as_gmappable :address => :address, :position => :pos
  
  field :pos,      :type => Array
  field :address,  :type => String
  field :gmaps,    :type => Boolean
end