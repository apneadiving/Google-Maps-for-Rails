class @Gmaps4Rails.GoogleKml extends Gmaps4Rails.Common

  @include Gmaps4Rails.GoogleShared

 #creates a single polyline, triggered by create_polylines
  constructor : (kml, controller) ->
    @controller = controller

    kml_options = kml.options || {}
    kml_options = @mergeObjects(kml_options, Gmaps4Rails.Kml.Class.DEFAULT_CONF)
    kml =  new google.maps.KmlLayer( kml.url, kml_options)
    kml.setMap @controller.getMapObject()
