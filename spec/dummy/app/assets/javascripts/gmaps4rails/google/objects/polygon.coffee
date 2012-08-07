class @Gmaps4Rails.GooglePolygon extends Gmaps4Rails.Common

  @include Gmaps4Rails.GoogleShared
  @extend  Gmaps4Rails.Polygon.Class
  @extend  Gmaps4Rails.Configuration

  constructor : (polygon, controller) ->
    @controller = controller
    polygon_coordinates = []

    #Polygon points are in an Array, that's why looping is necessary
    for point in polygon
      latlng = @createLatLng(point.lat, point.lng)
      polygon_coordinates.push(latlng)
      #first element of an Array could contain specific configuration for this particular polygon. If no config given, use default
      if point == polygon[0]
        strokeColor   = point.strokeColor   || @controller.polygons_conf.strokeColor
        strokeOpacity = point.strokeOpacity || @controller.polygons_conf.strokeOpacity
        strokeWeight  = point.strokeWeight  || @controller.polygons_conf.strokeWeight
        fillColor     = point.fillColor     || @controller.polygons_conf.fillColor
        fillOpacity   = point.fillOpacity   || @controller.polygons_conf.fillOpacity
        clickable     = point.clickable     || @controller.polygons_conf.clickable
        
    #Construct the polygon
    new_poly = new google.maps.Polygon
      paths:          polygon_coordinates
      strokeColor:    strokeColor
      strokeOpacity:  strokeOpacity
      strokeWeight:   strokeWeight
      fillColor:      fillColor
      fillOpacity:    fillOpacity
      clickable:      clickable
      map:            @controller.getMapObject()

    #save polygon in list
    @serviceObject = new_poly

