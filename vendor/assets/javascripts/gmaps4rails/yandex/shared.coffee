Gmaps4Rails.Yandex = {}

Gmaps4Rails.Yandex.Shared = 

  createPoint: (lat, lng) ->
    [lat, lng]

  createLatLng:(lat, lng) ->
    [lat, lng]
  
  createLatLngBounds: ->

  createSize: (width, height) ->
    [width, height]

  _addToMap: (object)->
    @controller.getMapObject().geoObjects.add(object)

  _removeFromMap: (object)->
    @controller.getMapObject().geoObjects.remove(object)