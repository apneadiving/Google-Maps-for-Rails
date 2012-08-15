#= require './common'
#= require './configuration'
#= require './gmaps'

#= require_tree './objects'
#= require_tree './main_controller_extensions'
#= require_tree './interfaces'

class @Gmaps4Rails.BaseController extends Gmaps4Rails.Common

  @include Gmaps4Rails.MarkerController
  @include Gmaps4Rails.PolylineController
  @include Gmaps4Rails.PolygonController
  @include Gmaps4Rails.CircleController
  @include Gmaps4Rails.KmlController

  @include Gmaps4Rails.Interfaces.Controller

  visibleInfoWindow: null  #contains the current opened infowindow
  userLocation:      null       #contains user's location if geolocalization was performed and successful

  #empty slots
  afterMapInitialization: -> false
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
  rootModule:   null

  constructor: ->
    @rootModule = @getModule()
    @markers_conf   = @rootModule.Marker.setConf()   if @rootModule.Marker? 
    @polylines_conf = @rootModule.Polyline.setConf() if @rootModule.Polyline? 
    @polygons_conf  = @rootModule.Polygon.setConf()  if @rootModule.Polygon? 
    @circles_conf   = @rootModule.Circle.setConf()   if @rootModule.Circle? 
 
  #////////////////////////////////////////////////////
  #/////////////// Basic Objects         //////////////
  #////////////////////////////////////////////////////

  createMap : ->
    new @rootModule.Map(@map_options, @)

  createMarker: (args)->
    new @rootModule.Marker(args, @)

  createPolyline: (args)->
    new @rootModule.Polyline(args, @)

  createPolygon: (args)->
    new @rootModule.Polygon(args, @)

  createCircle: (args)->
    new @rootModule.Circle(args, @)

  createKml: (args)->
    new @rootModule.Kml(args, @)

  #///////////////////////////////////
  #/////////////// Map  //////////////
  #///////////////////////////////////

  initialize : ->
    detectUserLocation = @map_options.detect_location or @map_options.center_on_user
    center_on_user     = @map_options.center_on_user
    @map = @createMap()
    @afterMapInitialization()
    
    delete @map_options

    if detectUserLocation
      @findUserLocation(this, center_on_user)

  getMapObject: ->
    @map.serviceObject

  adjustMapToBounds: ->
    @map.adjustToBounds() if @map.autoAdjustRequested()

  #////////////////////////////////////////////////////
  #/////////////// Miscellaneous         //////////////
  #////////////////////////////////////////////////////

  clusterize : ->
    if @markers_conf.do_clustering
      #first clear the existing clusterer if any
      @clearClusterer() if @markerClusterer?

      markers_array = []
      for marker in @markers
        markers_array.push(marker.serviceObject)

      @markerClusterer = @createClusterer(markers_array)

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