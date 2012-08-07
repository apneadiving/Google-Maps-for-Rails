class @Gmaps4Rails.GoogleCircle extends Gmaps4Rails.Common

  @include Gmaps4Rails.GoogleShared
  @extend  Gmaps4Rails.Circle.Class
  @extend  Gmaps4Rails.Configuration

 #creates a single polyline, triggered by create_polylines
  constructor : (circle, controller) ->
    @controller = controller

    #by convention, default style configuration could be integrated in the first element
    if circle == @controller.circles[0]
      @controller.circles_conf.strokeColor   = circle.strokeColor   if circle.strokeColor?
      @controller.circles_conf.strokeOpacity = circle.strokeOpacity if circle.strokeOpacity?
      @controller.circles_conf.strokeWeight  = circle.strokeWeight  if circle.strokeWeight?
      @controller.circles_conf.fillColor     = circle.fillColor     if circle.fillColor?
      @controller.circles_conf.fillOpacity   = circle.fillOpacity   if circle.fillOpacity?

    if circle.lat? and circle.lng?
      # always check if a config is given, if not, use defaults
      # NOTE: is there a cleaner way to do this? Maybe a hash merge of some sort?
      newCircle = new google.maps.Circle
        center:        @createLatLng(circle.lat, circle.lng)
        strokeColor:   circle.strokeColor   || @controller.circles_conf.strokeColor
        strokeOpacity: circle.strokeOpacity || @controller.circles_conf.strokeOpacity
        strokeWeight:  circle.strokeWeight  || @controller.circles_conf.strokeWeight
        fillOpacity:   circle.fillOpacity   || @controller.circles_conf.fillOpacity
        fillColor:     circle.fillColor     || @controller.circles_conf.fillColor
        clickable:     circle.clickable     || @controller.circles_conf.clickable
        zIndex:        circle.zIndex        || @controller.circles_conf.zIndex
        radius:        circle.radius

      @serviceObject = newCircle
      newCircle.setMap @controller.getMapObject()