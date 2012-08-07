#= require './shared'
#= require './map'
#= require './polyline'
#= require './marker'
#= require './polygon'
#= require './circle'

#######################################################################################################
##############################################  Google maps  ##########################################
#######################################################################################################

class @Gmaps4RailsGoogle extends Gmaps4Rails.Base

  @include Gmaps4Rails.GoogleShared
  
  constructor: ->
    @markers_conf   = Gmaps4Rails.GoogleMarker.setConf()
    @polylines_conf = Gmaps4Rails.GooglePolyline.setConf()
    @polygons_conf  = Gmaps4Rails.GooglePolygon.setConf()
    @circles_conf   = Gmaps4Rails.GoogleCircle.setConf()

    @markerImages = []

  #////////////////////////////////////////////////////
  #/////////////// Basic Objects         //////////////
  #////////////////////////////////////////////////////

  createMap : ->
    new Gmaps4Rails.GoogleMap(@map_options, @)

  createMarker: (args)->
    new Gmaps4Rails.GoogleMarker(args, @)

  createPolyline: (args)->
    new Gmaps4Rails.GooglePolyline(args, @)

  createPolygon: (args)->
    new Gmaps4Rails.GooglePolygon(args, @)

  createCircle: (args)->
    new Gmaps4Rails.GoogleCircle(args, @)

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
 
