class @Gmaps4Rails.Yandex.Map extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Map

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.Yandex.Shared
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
    
    yandexOptions = 
      center: @createLatLng(@options.center_latitude, @options.center_longitude)
      zoom:   @options.zoom
      behaviors: @options.behaviors

    mergedYandexOptions = @mergeObjects map_options.raw, yandexOptions

    @serviceObject = new ymaps.Map(@options.id, mergedYandexOptions)
    
  extendBoundsWithMarkers : (marker)->
    @controller.getMapObject().setBounds(@controller.getMapObject().geoObjects.getBounds());

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
