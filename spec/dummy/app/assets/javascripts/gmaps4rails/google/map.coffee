class @Gmaps4Rails.GoogleMap extends Gmaps4Rails.Common

  @include  Gmaps4Rails.Map
  @include  Gmaps4Rails.GoogleShared
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

  extendBoundsWithPolylines: ()->
    for polyline in @controller.polylines
      polyline_points = polyline.serviceObject.latLngs.getArray()[0].getArray()
      for point in polyline_points
        @boundsObject.extend point

  extendBounds: ()->
    for bound in @options.bounds
      #create points from bounds provided
      @boundsObject.extend @createLatLng(bound.lat, bound.lng)

  adaptToBounds:()->
    #if autozoom is false, take user info into account
    unless @options.auto_zoom
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