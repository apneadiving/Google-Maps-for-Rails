#= require './shared'

#= require_tree './objects'

class @Gmaps4RailsOpenlayers extends Gmaps4Rails.BaseController

  @include Gmaps4Rails.Openlayers.Shared
  
  constructor: ->
    super

    @markersControl = null
    @markersLayer   = null

    @polylinesLayer = null

  getModule: ->
    Gmaps4Rails.Openlayers

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////
  
  createClusterer: (marker_serviceObject_array)->
    style    = new OpenLayers.Style @_clustererOptions, @_clustererFunctions

    strategy = new OpenLayers.Strategy.Cluster
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

  clearClusterer: ->
    @getMapObject().removeLayer @markerClusterer if @clusterLayer? and @getMapObject().getLayer(@clusterLayer.id)?
    @clusterLayer = null

  #overwriting method from base controller since it doesn't fit here
  clearMarkers: ->
    @_clearMarkersLayer()
    @clearClusterer()
    @markers = []

  #////////////////////////////////////////////////////
  #/////////////// Private methods ////////////////////
  #////////////////////////////////////////////////////

  _createPolylinesLayer: ->  

    return if @polylinesLayer?
    @polylinesLayer = new OpenLayers.Layer.Vector("Polylines", null)
    @polylinesLayer.events.register("featureselected", @polylinesLayer, @_onFeatureSelect)
    @polylinesLayer.events.register("featureunselected", @polylinesLayer, @_onFeatureUnselect)
    @polylinesControl = new OpenLayers.Control.DrawFeature(@polylinesLayer, OpenLayers.Handler.Path)
    @getMapObject().addLayer(@polylinesLayer)

    @getMapObject().addControl(@polylinesControl)

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

  _clustererFunctions:
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

  _clustererOptions:  
    pointRadius:   "${radius}"
    fillColor:     "#ffcc66"
    fillOpacity:   0.8
    strokeColor:   "#cc6633"
    strokeWidth:   "${width}"
    label:         "${label}"