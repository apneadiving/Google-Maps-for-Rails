Gmaps4Rails.Interfaces ||= {}

Gmaps4Rails.Interfaces.Controller =

  # module is the namespace of the map provider you implement, ie: Gmaps4Rails.Google
  getModule: ->
    throw "getModule should be implemented in controller"

  # This method should create and return a clusterer object
  createClusterer : (markers_array) ->
    throw "createClusterer should be implemented in controller"

  # this method should reset the clusterer
  clearClusterer : ->
    throw "clearClusterer should be implemented in controller"
