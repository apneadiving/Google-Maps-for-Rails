class @Gmaps4Rails.Yandex.Map extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Map

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.Yandex.Shared
  @include  Gmaps4Rails.Configuration

  CONF:
    disableDefaultUI:       false
    disableDoubleClickZoom: false
    type:                   "yandex#map"   # "yandex#satellite", "yandex#hybrid", "yandex#publicMap", "yandex#publicMapHybrid"
    mapTypeControl:         null

  constructor:(map_options, controller) ->
    @controller    = controller

    defaultOptions = @setConf()
    @options  = @mergeObjects map_options, defaultOptions
    
    yandexOptions = 
      center: @createLatLng(@options.center_latitude, @options.center_longitude)
      zoom:   @options.zoom
      type:   @options.type

    mergedYandexOptions = @mergeObjects map_options.raw, yandexOptions

    @serviceObject = new ymaps.Map(@options.id, mergedYandexOptions)
    
  extendBoundsWithMarkers : ->
    @boundsObject = @serviceObject.geoObjects.getBounds();

  extendBoundsWithPolyline: (polyline)->

  extendBoundsWithPolygon: (polygon)->

  extendBoundsWithCircle: (circle)->

  extendBound: (bound)->

  fitBounds: ->
    @serviceObject.setBounds(@boundsObject) if @boundsObject?
  
  adaptToBounds: ->
    @fitBounds()

  centerMapOnUser : (position)->
    @serviceObject.setCenter position
