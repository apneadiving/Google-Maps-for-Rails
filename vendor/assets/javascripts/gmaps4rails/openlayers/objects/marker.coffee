class @Gmaps4Rails.Openlayers.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker

  @include Gmaps4Rails.Openlayers.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  

  constructor: (args, controller)->
    @controller = controller

    @controller._createMarkersLayer()

    @_createMarkerStyle(args)

    if @_isBasicMarker(args)
      @_styleForBasicMarker(args)
    else
      @_styleForCustomMarker(args)
      
    @serviceObject = new OpenLayers.Feature.Vector(
      @createPoint(args.lat, args.lng),
      null,
      @style_mark
    )
    #//changing coordinates so that it actually appears on the map!
    @serviceObject.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"))
    #//adding layer to the map
    @controller.markersLayer.addFeatures([@serviceObject])
    
  createInfoWindow : () ->
    @serviceObject.infoWindow = @description if @description?

  #cheap integration, I admit
  isVisible: ->
    true

  _isBasicMarker: (args)->
    !args.marker_picture?

  _createMarkerStyle: (args) ->
    @style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default'])
    @style_mark.fillOpacity = 1
    @style_mark.graphicTitle = args.marker_title

  _styleForBasicMarker: (args)->
    @style_mark.graphicHeight = 30
    @style_mark.externalGraphic = "http://openlayers.org/dev/img/marker-blue.png"

  _styleForCustomMarker: (args)->
    @style_mark.graphicWidth    = args.marker_width
    @style_mark.graphicHeight   = args.marker_height
    @style_mark.externalGraphic = args.marker_picture
    #//adding anchor if any
    if args.marker_anchor?
      @style_mark.graphicXOffset = args.marker_anchor[0]
      @style_mark.graphicYOffset = args.marker_anchor[1]
    #//adding shadow if any
    if args.shadow_picture?
      @style_mark.backgroundGraphic = args.shadow_picture
      @style_mark.backgroundWidth   = args.shadow_width
      @style_mark.backgroundHeight  = args.shadow_height
      #//adding shadow's anchor if any
      if args.shadow_anchor?
        @style_mark.backgroundXOffset = args.shadow_anchor[0]
        @style_mark.backgroundYOffset = args.shadow_anchor[1]