class @Gmaps4Rails.OpenlayersMap extends Gmaps4Rails.Common

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.OpenlayersShared
  @include  Gmaps4Rails.Configuration

  CONF:
    disableDefaultUI:       false
    disableDoubleClickZoom: false
    type:                   "ROADMAP" # HYBRID, ROADMAP, SATELLITE, TERRAIN
    mapTypeControl:         null

  constructor:(map_options, controller) ->
    @controller    = controller

    defaultOptions = @setConf()
    @options  = @mergeObjects map_options, defaultOptions

    @serviceObject = new OpenLayers.Map(@options.id)
    @serviceObject.addLayer(new OpenLayers.Layer.OSM())
    @serviceObject.setCenter(
      @createLatLng(@options.center_latitude, @options.center_longitude), # Center of the map
      @options.zoom # Zoom level
    )

  extendBoundsWithMarker : (marker)->
    @boundsObject.extend(@createLatLng(marker.lat,marker.lng))

  extendBoundsWithPolyline: (polyline)->

  extendBoundsWithPolygon: (polygon)->

  extendBoundsWithCircle: (circle)->

  extendBound: (bound)->

  fitBounds: ->
    @serviceObject.zoomToExtent(@boundsObject, true)
  
  adaptToBounds: ->
    @fitBounds()

  centerMapOnUser : (position)->
    @serviceObject.setCenter position
