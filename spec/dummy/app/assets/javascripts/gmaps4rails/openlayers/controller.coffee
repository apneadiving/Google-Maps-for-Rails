#= require './shared'

#= require './objects/map'

# require './objects/polyline'
#= require './objects/marker'
# require './objects/polygon'


#######################################################################################################
##############################################  Google maps  ##########################################
#######################################################################################################

class @Gmaps4RailsOpenlayers extends Gmaps4Rails.Base

  @include Gmaps4Rails.OpenlayersShared
  
  constructor: ->
    @markersControl = null
    @markersLayer   = null

    @polylinesLayer = null

    @markers_conf   = Gmaps4Rails.OpenlayersMarker.setConf()

  #////////////////////////////////////////////////////
  #/////////////// Basic Objects         //////////////
  #////////////////////////////////////////////////////

  createMap : ->
    new Gmaps4Rails.OpenlayersMap(@map_options, @)

  createMarker: (args)->
    new Gmaps4Rails.OpenlayersMarker(args, @)

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////

  clusterize: ->
    if @markers_conf.do_clustering
      #//first clear the existing clusterer if any
      if @markerClusterer?
        @clearClusterer()
      markers_array = []
      for marker in @markers
        markers_array.push(marker.serviceObject)
      @markerClusterer = @_createClusterer markers_array
   
  clearClusterer: ->
    @getMapObject().removeLayer @markerClusterer if @clusterLayer? and @getMapObject().getLayer(@clusterLayer.id)?
    @clusterLayer = null

  ##############################

  clearMarkers: ->
    @_clearMarkersLayer()
    @clearClusterer()
    @markers = []
    @boundsObject = new OpenLayers.Bounds()


  #### Private methods

  _createMarkersLayer: ->  
    return if @markersLayer?

    @markersLayer = new OpenLayers.Layer.Vector("Markers", null)
    @getMapObject().addLayer @markersLayer

    @markersLayer.events.register("featureselected", @markersLayer, @_onFeatureSelect())
    @markersLayer.events.register("featureunselected", @markersLayer, @_onFeatureUnselect())
    
    @markersControl = new OpenLayers.Control.SelectFeature @markersLayer
    
    @getMapObject().addControl @markersControl
    @markersControl.activate()

  _clearMarkersLayer: -> 
    @getMapObject().removeLayer(@markersLayer) if @markersLayer? and @getMapObject().getLayer(@markersLayer.id)?
    @markersLayer = null
  
  _onFeatureSelect: ->
    controller = @
    return (evt) ->
      feature = evt.feature
   
      popup = new OpenLayers.Popup.FramedCloud(
        "featurePopup",
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(300,200),
        feature.infoWindow,
        null, 
        true,
        controller._onPopupClose(controller, feature)
      )
      feature.popup = popup
      popup.feature = feature
      controller.getMapObject().addPopup popup

  _onFeatureUnselect: ->
    controller = @

    return (evt)->
      feature = evt.feature

      if feature.popup?
        controller.getMapObject().removePopup feature.popup
        feature.popup.destroy()
        feature.popup = null
  
  _onPopupClose: (controller, feature) ->
    return ->
      controller.markersControl.unselect feature

 _createClusterer: (marker_serviceObject_array)->
    options = 
      pointRadius:   "${radius}"
      fillColor:     "#ffcc66"
      fillOpacity:   0.8
      strokeColor:   "#cc6633"
      strokeWidth:   "${width}"
      strokeOpacity: 0.8
      label:         "${label}"

    funcs =
      context:
        width:  (feature) ->
          return (feature.cluster) ? 2 : 1
        radius: (feature) ->
          pix = 2
          pix = feature.cluster.length + 10 if feature.cluster
          return pix
        label: (feature) ->
          if feature.cluster 
            return feature.cluster.length
          else
            return ""

    style    = new OpenLayers.Style options, funcs
   
    strategy = new OpenLayers.Strategy.Cluster(
      threshold: 1
    )
    @_clearMarkersLayer()

    @clusterLayer = new OpenLayers.Layer.Vector "Clusters", 
      strategies: [strategy]
      styleMap: new OpenLayers.StyleMap
        "default": style
        "select": 
            fillColor: "#8aeeef"
            strokeColor: "#32a8a9"
      
    @getMapObject().addLayer @clusterLayer
    @clusterLayer.addFeatures marker_serviceObject_array
    @clusterLayer
