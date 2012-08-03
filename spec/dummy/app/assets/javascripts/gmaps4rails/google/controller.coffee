#######################################################################################################
##############################################  Google maps  ##########################################
#######################################################################################################

class @Gmaps4RailsGoogle extends Gmaps4Rails.Base

  @include Gmaps4Rails.GoogleShared
  
  constructor: ->
    @markers_conf = Gmaps4Rails.GoogleMarker.setMarkersConf()
    @markerImages = []

  #////////////////////////////////////////////////////
  #/////////////// Basic Objects         //////////////
  #////////////////////////////////////////////////////

  createMap : ->
    #@map_options = Gmaps4Rails.GoogleMap.setMapOptions()
    @map = new Gmaps4Rails.GoogleMap(@map_options, @)
    delete @map_options
    #@serviceObject = Gmaps4Rails.GoogleMap.createMap(@map_options)

  createMarker: (args)->
    return new Gmaps4Rails.GoogleMarker(args, @)

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
      @clearClusterer() if @markerClusterer?

      markers_array = new Array
      for marker in @markers
        markers_array.push(marker.serviceObject)

      @markerClusterer = @createClusterer(markers_array)

            
  #////////////////////////////////////////////////////
  #/////////////////// Other methods //////////////////
  #////////////////////////////////////////////////////

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

  _closeVisibleInfoWindow: ->
    @visibleInfowindow.close() if @visibleInfowindow?

  _setVisibleInfoWindow: (infowindow)->
    @visibleInfowindow = infowindow
