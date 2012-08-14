class @Gmaps4Rails.Google.Kml extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Basic

  @include Gmaps4Rails.Google.Shared
  @include Gmaps4Rails.Kml.Instance

 #creates a single polyline, triggered by create_polylines
  constructor : (kmlData, controller) ->
    @controller = controller

    @options = kmlData.options || {}
    @options = @mergeObjects(@options, @DEFAULT_CONF)
    kml =  new google.maps.KmlLayer( kmlData.url, @options)
    kml.setMap @controller.getMapObject()
    @serviceObject = kml
