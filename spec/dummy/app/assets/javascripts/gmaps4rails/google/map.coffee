class @Gmaps4Rails.GoogleMap extends Gmaps4Rails.Common

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.GoogleShared

  MAP_OPTIONS:
    disableDefaultUI:       false
    disableDoubleClickZoom: false
    type:                   "ROADMAP" # HYBRID, ROADMAP, SATELLITE, TERRAIN
    mapTypeControl:         null

  constructor:(map_options, controller) ->
    @controller    = controller

    defaultOptions = @getDefaultMapOptions()
    @options  = @mergeObjects map_options, defaultOptions

    googleOptions =
      maxZoom:                @options.maxZoom
      minZoom:                @options.minZoom
      zoom:                   @options.zoom
      center:                 @createLatLng(@options.center_latitude, @options.center_longitude)
      mapTypeId:              google.maps.MapTypeId[@options.type]
      mapTypeControl:         @options.mapTypeControl
      disableDefaultUI:       @options.disableDefaultUI
      disableDoubleClickZoom: @options.disableDoubleClickZoom
      draggable:              @options.draggable
    
    mergedGoogleOptions = @mergeObjects map_options.raw, googleOptions

    @serviceObject = new google.maps.Map document.getElementById(@options.id), mergedGoogleOptions

  extendBoundsWithMarkers : ->
    for marker in @controller.markers
      @boundsObject.extend(marker.serviceObject.position)

  extendBounds: ()->
    for bound in @options.bounds
      #create points from bounds provided
      @boundsObject.extend @createLatLng(bound.lat, bound.lng)

  adaptToBounds:()->
    #if autozoom is false, take user info into account
    if !@options.auto_zoom
      map_center = @boundsObject.getCenter()
      @options.center_latitude  = map_center.lat()
      @options.center_longitude = map_center.lng()
      @serviceObject.setCenter(map_center)
    else
      @fitBounds()

  fitBounds : ->
    @serviceObject.fitBounds(@boundsObject) unless @boundsObject.isEmpty()

  centerMapOnUser : (position)->
    @serviceObject.setCenter(position)