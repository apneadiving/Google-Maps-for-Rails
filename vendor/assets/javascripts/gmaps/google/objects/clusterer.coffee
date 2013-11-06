class @Gmaps.Google.Objects.Clusterer

  constructor: (@serviceObject)->

  addMarkers: (markers)->
    _.each markers, (marker)=>
      @addMarker(marker)

  addMarker: (marker)->
    @getServiceObject().addMarker(marker.getServiceObject())

  clear: ->
    @getServiceObject().clearMarkers()

  removeMarker: (marker)->
    @getServiceObject().removeMarker marker.getServiceObject()

  getServiceObject: ->
    @serviceObject

