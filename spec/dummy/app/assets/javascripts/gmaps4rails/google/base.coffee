#######################################################################################################
##############################################  Google maps  ##########################################
#######################################################################################################

class @Gmaps4RailsGoogle extends Gmaps4Rails.Base

  @include Gmaps4Rails.GoogleShared
  
  constructor: ->
    @map_options = Gmaps4Rails.GoogleMap.setMapOptions()
    @markers_conf = Gmaps4Rails.GoogleMarker.setMarkersConf()

  #////////////////////////////////////////////////////
  #/////////////// Basic Objects         //////////////
  #////////////////////////////////////////////////////

  createMap : ->
    @serviceObject = Gmaps4Rails.GoogleMap.createMap(@map_options)


  #create google.maps Markers from data provided by user
  createServiceMarkersFromMarkers : ->
    tempArray = []
    for marker, index in @markers
      tempArray.push new Gmaps4Rails.GoogleMarker(marker, @serviceObject)
    @markers = tempArray

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////

  createClusterer : (markers_array) ->
    return new MarkerClusterer( @serviceObject, markers_array, {  maxZoom: @markers_conf.clusterer_maxZoom, gridSize: @markers_conf.clusterer_gridSize, styles: @customClusterer() })

  clearClusterer : ->
    @markerClusterer.clearMarkers()

  #creates clusters
  clusterize : ->
    if @markers_conf.do_clustering == true
      #first clear the existing clusterer if any
      @clearClusterer() if @markerClusterer != null

      markers_array = new Array
      for marker in @markers
        markers_array.push(marker.serviceObject)

      @markerClusterer = @createClusterer(markers_array)

            
  #////////////////////////////////////////////////////
  #/////////////////// Other methods //////////////////
  #////////////////////////////////////////////////////

  fitBounds : ->
    @serviceObject.fitBounds(@boundsObject) unless @boundsObject.isEmpty()

  centerMapOnUser : ->
    @serviceObject.setCenter(@userLocation)
  
  updateBoundsWithPolygons: ()->
    for polygon in @polygons
      polygon_points = polygon.serviceObject.latLngs.getArray()[0].getArray()
      for point in polygon_points
        @boundsObject.extend point

  updateBoundsWithCircles: ()->
    for circle in @circles
      @boundsObject.extend(circle.serviceObject.getBounds().getNorthEast())
      @boundsObject.extend(circle.serviceObject.getBounds().getSouthWest())

  extendMapBounds: ()->
    for bound in @map_options.bounds
      #create points from bounds provided
      @boundsObject.extend @createLatLng(bound.lat, bound.lng)
  
  adaptMapToBounds:()->
    #if autozoom is false, take user info into account
    if !@map_options.auto_zoom
      map_center = @boundsObject.getCenter()
      @map_options.center_latitude  = map_center.lat()
      @map_options.center_longitude = map_center.lng()
      @serviceObject.setCenter(map_center)
    else
      @fitBounds()

  #clear markers
  clearMarkers : ->
    for marker in @markers
      marker.clear()

  #show and hide markers
  showMarkers : ->
    for marker in @markers
      marker.show()

  hideMarkers : ->
    for marker in @markers
      marker.hide()

