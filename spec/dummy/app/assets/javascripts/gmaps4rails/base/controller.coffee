#= require './common'
#= require './configuration'
#= require './gmaps'

#= require './objects/map'
#= require './objects/marker'
#= require './objects/polyline'
#= require './objects/polygon'
#= require './objects/circle'
#= require './objects/kml'

#= require './controller_extensions/marker_controller'
#= require './controller_extensions/polyline_controller'
#= require './controller_extensions/polygon_controller'
#= require './controller_extensions/circle_controller'
#= require './controller_extensions/kml_controller'

class @Gmaps4Rails.Base extends Gmaps4Rails.Common

  @include Gmaps4Rails.MarkerController
  @include Gmaps4Rails.PolylineController
  @include Gmaps4Rails.PolygonController
  @include Gmaps4Rails.CircleController
  @include Gmaps4Rails.KmlController

  visibleInfoWindow: null  #contains the current opened infowindow
  userLocation:      null       #contains user's location if geolocalization was performed and successful

  #empty slots
  geolocationSuccess: -> false
  geolocationFailure: -> false  #triggered when geolocation fails. If customized, must be like= function(navigator_handles_geolocation){} where 'navigator_handles_geolocation' is a boolean
  callback:           -> false  #to let user set a custom callback function
  customClusterer:    -> false  #to let user set custom clusterer pictures
  infobox:            -> false  #to let user use custom infoboxes
  jsTemplate:         false     #to let user create infowindows client side
  

  #Stored variables
  map_options:  {}            # deleted once map is created
  markers:      []            # contains all markers. A marker contains the following: {"description": , "longitude": , "title":, "latitude":, "picture": "", "width": "", "length": "", "sidebar": "", "serviceObject": google_marker}
  boundsObject: null     # contains current bounds from markers, polylines etc...
  polygons:     []           # contains raw data, array of arrays (first element could be a hash containing options)
  polylines:    []          # contains raw data, array of arrays (first element could be a hash containing options)
  circles:      []            # contains raw data, array of hash
  markerClusterer: null  # contains all marker clusterers
  markerImages: []
  kmls:         []

  initialize : ->
    detectUserLocation = @map_options.detect_location or @map_options.center_on_user
    center_on_user     = @map_options.center_on_user
    @map = @createMap()
    delete @map_options

    if detectUserLocation
      @findUserLocation(this, center_on_user)

  getMapObject: ->
    @map.serviceObject

  adjustMapToBounds: ->
    @map.adjustToBounds()

  findUserLocation : (controller, center_on_user) ->
    if navigator.geolocation
      #try to retrieve user's position
      positionSuccessful = (position) ->
        controller.userLocation = controller.createLatLng(position.coords.latitude, position.coords.longitude)
        #change map's center to focus on user's geoloc if asked
        controller.geolocationSuccess()
        if center_on_user
          controller.map.centerMapOnUser(controller.userLocation)
      positionFailure = (error)->
        controller.geolocationFailure(true)

      navigator.geolocation.getCurrentPosition( positionSuccessful, positionFailure)
    else
      #failure but the navigator doesn't handle geolocation
      controller.geolocationFailure(false)