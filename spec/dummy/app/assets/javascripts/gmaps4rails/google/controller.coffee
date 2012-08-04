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
    new Gmaps4Rails.GoogleMap(@map_options, @)

  createMarker: (args)->
    new Gmaps4Rails.GoogleMarker(args, @)

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////

  createClusterer : (markers_array) ->
    new MarkerClusterer( @getMapObject(), markers_array, {  maxZoom: @markers_conf.clusterer_maxZoom, gridSize: @markers_conf.clusterer_gridSize, styles: @customClusterer() })

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

  _closeVisibleInfoWindow: ->
    @visibleInfowindow.close() if @visibleInfowindow?

  _setVisibleInfoWindow: (infowindow)->
    @visibleInfowindow = infowindow
 
