class @Gmaps.Google.Objects.Map extends Gmaps.Base

  constructor: (@serviceObject)->

  getServiceObject: ->
    @serviceObject

  # position can be:
  # - [ lat, lng]
  # - { lat: , lng: }
  # - a google.maps.LatLng
  centerOn: (position)->
    @getServiceObject().setCenter @primitives().latLngFromPosition(position)

  fitToBounds: (boundsObject)->
    @getServiceObject().fitBounds(boundsObject) unless boundsObject.isEmpty()

  primitives: ->
    @constructor.PRIMITIVES
