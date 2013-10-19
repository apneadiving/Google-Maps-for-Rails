class @Gmaps.Google.Objects.Clusterer

  constructor: (@args, @options)->
    @serviceObject = new @PRIMITIVES.clusterer(@args.map, [], @options)

  addMarkers: (markers)=>
    _.each markers, (marker)=>
      @addMarker(marker)

  addMarker: (marker)=>
    @serviceObject.addMarker(marker.serviceObject)

  clear: =>
    @serviceObject.clearMarkers()
