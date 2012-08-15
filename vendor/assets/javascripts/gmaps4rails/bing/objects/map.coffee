class @Gmaps4Rails.Bing.Map extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Map

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.Bing.Shared
  @include  Gmaps4Rails.Configuration

  CONF:
    type:  "road" # aerial, auto, birdseye, collinsBart, mercator, ordnanceSurvey, road

  constructor:(map_options, controller) ->
    @controller    = controller

    defaultOptions = @setConf()
    @options  = @mergeObjects map_options, defaultOptions

    bingOptions = 
      credentials:  @options.provider_key,
      mapTypeId:    @_getMapType(@options),
      center:       @createLatLng(@options.center_latitude, @options.center_longitude),
      zoom:         @options.zoom

    mergedBingOptions = @mergeObjects map_options.raw, bingOptions

    @serviceObject = new Microsoft.Maps.Map(document.getElementById(@options.id), mergedBingOptions)

  extendBoundsWithMarkers : ->
    locationsArray = []
    for marker in @controller.markers
      locationsArray.push(marker.serviceObject.getLocation())
    @boundsObject = Microsoft.Maps.LocationRect.fromLocations(locationsArray)

  extendBoundsWithPolyline: (polyline)->

  extendBoundsWithPolygon: (polygon)->

  extendBoundsWithCircle: (circle)->

  extendBound: (bound)->

  adaptToBounds: ->
    @_fitBounds()

  centerMapOnUser : (position)->
    @serviceObject.setView({ center: position})
  
  _fitBounds: ->
    @serviceObject.setView({bounds: @boundsObject})

  _getMapType: (map_options)-> 
    switch map_options.type
      when "road"           then return Microsoft.Maps.MapTypeId.road
      when "aerial"         then return Microsoft.Maps.MapTypeId.aerial
      when "auto"           then return Microsoft.Maps.MapTypeId.auto
      when "birdseye"       then return Microsoft.Maps.MapTypeId.birdseye
      when "collinsBart"    then return Microsoft.Maps.MapTypeId.collinsBart
      when "mercator"       then return Microsoft.Maps.MapTypeId.mercator
      when "ordnanceSurvey" then return Microsoft.Maps.MapTypeId.ordnanceSurvey
      else return Microsoft.Maps.MapTypeId.auto


    