Gmaps4Rails.Bing = {}

Gmaps4Rails.Bing.Shared = 

  createPoint: (lat, lng) ->
    new Microsoft.Maps.Point(lat, lng)

  createLatLng:(lat, lng) ->
    new Microsoft.Maps.Location(lat, lng)
  
  createLatLngBounds: ->

  createSize: (width, height) ->
    new google.maps.Size(width, height)

  _addToMap: (object)->
    @controller.getMapObject().entities.push(object)

  _removeFromMap: (object)->
    @controller.getMapObject().entities.remove(object)