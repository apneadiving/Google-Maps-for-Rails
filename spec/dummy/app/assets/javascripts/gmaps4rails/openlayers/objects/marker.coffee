class @Gmaps4Rails.OpenlayersMarker extends Gmaps4Rails.Common

  @include Gmaps4Rails.OpenlayersShared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  

  constructor: (args, controller)->
    @controller = controller

    style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default'])
    style_mark.fillOpacity = 1

    @controller._createMarkersLayer()

    #//showing default pic if none available
    #unless args.marker_picture?
      #style_mark.graphicWidth = 24
    style_mark.graphicHeight = 30
    style_mark.externalGraphic = "http://openlayers.org/dev/img/marker-blue.png"
    #//creating custom pic
    # else
    #   style_mark.graphicWidth    = args.marker_width
    #   style_mark.graphicHeight   = args.marker_height
    #   style_mark.externalGraphic = args.marker_picture
    #   #//adding anchor if any
    #   if args.marker_anchor?
    #     style_mark.graphicXOffset = args.marker_anchor[0]
    #     style_mark.graphicYOffset = args.marker_anchor[1]
    #   #//adding shadow if any
    #   if args.shadow_picture?
    #     style_mark.backgroundGraphic = args.shadow_picture
    #     style_mark.backgroundWidth   = args.shadow_width
    #     style_mark.backgroundHeight  = args.shadow_height
    #     #//adding shadow's anchor if any
    #     if args.shadow_anchor?
    #       style_mark.backgroundXOffset = args.shadow_anchor[0]
    #       style_mark.backgroundYOffset = args.shadow_anchor[1]
      
    style_mark.graphicTitle = args.title
    @serviceObject = new OpenLayers.Feature.Vector(
      new OpenLayers.Geometry.Point(args.lng, args.lat),
      null,
      style_mark
    )
    #//changing coordinates so that it actually appears on the map!
    @serviceObject.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"))
    #//adding layer to the map
    @controller.markersLayer.addFeatures([@serviceObject])

    
  createInfoWindow : () ->
    @serviceObject.infoWindow = @description if @description?

  