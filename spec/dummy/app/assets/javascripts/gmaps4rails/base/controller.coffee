#= require './common'
#= require './gmaps'
#= require './map'
#= require './marker'
#= require './controller/marker_controller'

class @Gmaps4Rails.Base extends Gmaps4Rails.Common

  @include Gmaps4Rails.Marker.Controller

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

  initialize : ->
    detectUserLocation = @map_options.detect_location or @map_options.center_on_user
    center_on_user     = @map_options.center_on_user
    @createMap()
    #@map = @serviceObject #beware, soon deprecated
    if detectUserLocation
      @findUserLocation(this, center_on_user)
    #resets sidebar if needed
    @resetSidebarContent()

  getMapObject: ->
    return @map.serviceObject

  #////////////////////////////////////////////////////
  #///////////////////// SIDEBAR //////////////////////
  #////////////////////////////////////////////////////

  #//creates sidebar
  createSidebar : (marker_container) ->
    if (@markers_conf.list_container)
      ul = document.getElementById(@markers_conf.list_container)
      li = document.createElement('li')
      aSel = document.createElement('a')
      aSel.href = 'javascript:void(0);'
      html = if marker_container.sidebar? then marker_container.sidebar else "Marker"
      aSel.innerHTML = html
      currentMap = this
      aSel.onclick = @sidebar_element_handler(currentMap, marker_container.serviceObject, 'click')
      li.appendChild(aSel)
      ul.appendChild(li)

  #moves map to marker clicked + open infowindow
  sidebar_element_handler : (currentMap, marker, eventType) ->
    return () ->
      currentMap.map.panTo(marker.position)
      google.maps.event.trigger(marker, eventType)


  resetSidebarContent : ->
    # if @markers_conf.list_container isnt null
    #   ul = document.getElementById(@markers_conf.list_container)
    #   ul.innerHTML = ""
  adjustMapToBounds: ->
    @map.adjustToBounds()