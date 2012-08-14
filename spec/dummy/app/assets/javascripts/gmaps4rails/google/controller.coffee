#= require './shared'

#= require_tree './objects'

#######################################################################################################
##############################################  Google maps  ##########################################
#######################################################################################################

class @Gmaps4RailsGoogle extends Gmaps4Rails.BaseController

  @include Gmaps4Rails.Google.Shared
  
  getModule: ->
    Gmaps4Rails.Google

  constructor: ->
    super
    @markerImages = []

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
 
