Gmaps4Rails.Yandex = {}

Gmaps4Rails.Yandex.Shared = 

  createPoint: (lat, lng) ->
    [lat, lng]

  createLatLng:(lat, lng) ->
    [lat, lng]
  
  createLatLngBounds: ->

  createSize: (width, height) ->
    new google.maps.Size(width, height)

  _addToMap: (object)->
    @controller.getMapObject().entities.push(object)

  _removeFromMap: (object)->
    @controller.getMapObject().entities.remove(object)