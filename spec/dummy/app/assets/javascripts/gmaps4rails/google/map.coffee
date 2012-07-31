class @Gmaps4Rails.GoogleMap extends Gmaps4Rails.Common

  @extend  Gmaps4Rails.Map
  @extend  Gmaps4Rails.GoogleShared

  @MAP_OPTIONS:
    disableDefaultUI:       false
    disableDoubleClickZoom: false
    type:                   "ROADMAP" # HYBRID, ROADMAP, SATELLITE, TERRAIN
    
  @createMap:(map_options) ->
    defaultOptions =
      maxZoom:                map_options.maxZoom
      minZoom:                map_options.minZoom
      zoom:                   map_options.zoom
      center:                 @createLatLng(map_options.center_latitude, map_options.center_longitude)
      mapTypeId:              google.maps.MapTypeId[map_options.type]
      mapTypeControl:         map_options.mapTypeControl
      disableDefaultUI:       map_options.disableDefaultUI
      disableDoubleClickZoom: map_options.disableDoubleClickZoom
      draggable:              map_options.draggable

    mergedOptions = @mergeObjects map_options.raw, defaultOptions

    return new google.maps.Map document.getElementById(map_options.id), mergedOptions
