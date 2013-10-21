class @Gmaps.Google.Objects.Clusterer

  constructor: (@serviceObject)->

  addMarkers: (markers)=>
    _.each markers, (marker)=>
      @addMarker(marker)

  addMarker: (marker)=>
    @serviceObject.addMarker(marker.serviceObject)

  clear: =>
    @serviceObject.clearMarkers()
