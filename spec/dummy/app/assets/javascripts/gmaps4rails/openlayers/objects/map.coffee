class @Gmaps4Rails.Openlayers.Map extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Map

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.Openlayers.Shared
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
    
    openlayersOptions = 
      center: @createLatLng(@options.center_latitude, @options.center_longitude)
      zoom:   @options.zoom

    mergedOpenlayersOptions = @mergeObjects map_options.raw, openlayersOptions

    @serviceObject = new OpenLayers.Map(@options.id, mergedOpenlayersOptions)
    
    @serviceObject.addLayer(new OpenLayers.Layer.OSM())

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
