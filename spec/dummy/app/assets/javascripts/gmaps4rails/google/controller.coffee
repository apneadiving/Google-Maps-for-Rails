#= require './shared'
#= require './map'
#= require './controller'
#= require './marker'

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
    @map = new Gmaps4Rails.GoogleMap(@map_options, @)
    delete @map_options

  createMarker: (args)->
    return new Gmaps4Rails.GoogleMarker(args, @)

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////

  createClusterer : (markers_array) ->
    return new MarkerClusterer( @getMapObject(), markers_array, {  maxZoom: @markers_conf.clusterer_maxZoom, gridSize: @markers_conf.clusterer_gridSize, styles: @customClusterer() })

  clearClusterer : ->
    @markerClusterer.clearMarkers()

  #creates clusters
  clusterize : ->
    if @markers_conf.do_clustering
      #first clear the existing clusterer if any
      @clearClusterer() if @markerClusterer?

      markers_array = []
      for marker in @markers
        markers_array.push(marker.serviceObject)

      @markerClusterer = @createClusterer(markers_array)

  findUserLocation : (controller, center_on_user) ->
    if navigator.geolocation
      #try to retrieve user's position
      positionSuccessful = (position) ->
        controller.userLocation = controller.createLatLng(position.coords.latitude, position.coords.longitude)
        #change map's center to focus on user's geoloc if asked
        controller.geolocationSuccess()
        if center_on_user
          controller.map.centerMapOnUser(controller.userLocation)
      positionFailure = (error)->
        controller.geolocationFailure(true)

      navigator.geolocation.getCurrentPosition( positionSuccessful, positionFailure)
    else
      #failure but the navigator doesn't handle geolocation
      controller.geolocationFailure(false)

  _closeVisibleInfoWindow: ->
    @visibleInfowindow.close() if @visibleInfowindow?

  _setVisibleInfoWindow: (infowindow)->
    @visibleInfowindow = infowindow
 
