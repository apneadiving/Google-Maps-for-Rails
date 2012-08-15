class @Gmaps4Rails.Openlayers.Polyline extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Basic

  @include Gmaps4Rails.Openlayers.Shared
  @extend  Gmaps4Rails.Polyline.Class
  @extend  Gmaps4Rails.Configuration

 #creates a single polyline, triggered by create_polylines
  constructor : (polyline, controller) ->
    @controller = controller
    @controller._createPolylinesLayer()

    polyline_coordinates = []

    for element in polyline
      #by convention, a single polyline could be customized in the first array or it uses default values
      if element == polyline[0]
        strokeColor   = element.strokeColor   || @controller.polylines_conf.strokeColor
        strokeOpacity = element.strokeOpacity || @controller.polylines_conf.strokeOpacity
        strokeWeight  = element.strokeWeight  || @controller.polylines_conf.strokeWeight
        clickable     = element.clickable     || @controller.polylines_conf.clickable
        zIndex        = element.zIndex        || @controller.polylines_conf.zIndex   
      
      #add latlng if positions provided
      if element.lat? && element.lng?
        latlng = new OpenLayers.Geometry.Point(element.lng, element.lat)
        polyline_coordinates.push(latlng)
    
    line_points = new OpenLayers.Geometry.LineString(polyline_coordinates);
    line_style = { strokeColor: strokeColor, strokeOpacity: strokeOpacity, strokeWidth: strokeWeight };
   
    @serviceObject = new OpenLayers.Feature.Vector(line_points, null, line_style);
    @serviceObject.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"))

    @controller.polylinesLayer.addFeatures([@serviceObject])

  isVisible: ->
    true