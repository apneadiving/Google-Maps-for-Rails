class Gmaps4Rails.Google.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker
  
  @include Gmaps4Rails.Google.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  
  @CONF:
    clusterer_gridSize:      50
    clusterer_maxZoom:       5
    custom_cluster_pictures: null
    custom_infowindow_class: null
    raw:                     {}

  constructor: (args, controller)->
    @controller = controller

    markerLatLng = @createLatLng(args.lat, args.lng)
    #Marker sizes are expressed as a Size of X,Y
    if @_isBasicMarker(args)
      @_createBasicMarker(markerLatLng, args)
        
    else 
      if args.rich_marker?
        @_createRichMarker(markerLatLng, args)
      else
        @_createMarker(markerLatLng, args)
    
    #// creates infowindows
  createInfoWindow : () ->
    if typeof(@controller.jsTemplate) == "function" or @description?
      @description = @controller.jsTemplate(@) if typeof(@controller.jsTemplate) == "function"
      if @controller.markers_conf.custom_infowindow_class?
        #creating custom infowindow
        boxText = document.createElement("div")
        boxText.setAttribute("class", @controller.markers_conf.custom_infowindow_class) #to customize
        boxText.innerHTML = @description
        @infowindow = new InfoBox(@infobox(boxText))
        google.maps.event.addListener(@serviceObject, 'click', @_openInfowindow())
      else
        #create default infowindow
        @infowindow = new google.maps.InfoWindow({content: @description })
        #add the listener associated
        google.maps.event.addListener(@serviceObject, 'click', @_openInfowindow())

  _createBasicMarker:(markerLatLng, args)->
    defaultOptions = {position: markerLatLng, map: @getMap(), title: args.marker_title, draggable: args.marker_draggable, zIndex: args.zindex}
    mergedOptions  = @mergeObjects @controller.markers_conf.raw, defaultOptions
    @serviceObject = new google.maps.Marker mergedOptions

  _createRichMarker: (markerLatLng, args)->
    @serviceObject = new RichMarker({
      position:  markerLatLng
      map:       @getMap()
      draggable: args.marker_draggable
      content:   args.rich_marker
      flat:      if args.marker_anchor? then args.marker_anchor[1] else false
      anchor:    if args.marker_anchor? then args.marker_anchor[0] else null
      zIndex:    args.zindex
    })

  _createMarker: (markerLatLng, args)->
    #calculate MarkerImage anchor location
    imageAnchorPosition  = @_createImageAnchorPosition args.marker_anchor
    shadowAnchorPosition = @_createImageAnchorPosition args.shadow_anchor
    #create or retrieve existing MarkerImages
    markerImage = @_createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition)
    shadowImage = @_createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition)
    defaultOptions = {position: markerLatLng, map: @getMap(), icon: markerImage, title: args.marker_title, draggable: args.marker_draggable, shadow: shadowImage,  zIndex: args.zindex}
    mergedOptions  = @mergeObjects @controller.markers_conf.raw, defaultOptions
    @serviceObject = new google.maps.Marker mergedOptions

  #checks if obj is included in arr Array and returns the position or false
  _includeMarkerImage : (obj) ->
    for object, index in @controller.markerImages
      return index if object.url == obj
    return false

  #checks if MarkerImage exists before creating a new one
  #returns a MarkerImage or false if ever something wrong is passed as argument
  _createOrRetrieveImage : (currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition) ->
    return null if (typeof(currentMarkerPicture) == "undefined" or currentMarkerPicture == "" or currentMarkerPicture == null )

    if !(test_image_index = @_includeMarkerImage(currentMarkerPicture))
      markerImage = @_createMarkerImage(currentMarkerPicture, @createSize(markerWidth, markerHeight), null, imageAnchorPosition, null )
      @controller.markerImages.push(markerImage)
      return markerImage
    else
      return @controller.markerImages[test_image_index] if typeof test_image_index == 'number'
      return false

  _isBasicMarker: (args)->
    !args.marker_picture? and !args.rich_marker?
  
  _createMarkerImage : (markerPicture, markerSize, origin, anchor, scaledSize) ->
    new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize)

  #creates Image Anchor Position or return null if nothing passed
  _createImageAnchorPosition : (anchorLocation) ->
    if (anchorLocation == null)
      return null
    else
      return @createPoint(anchorLocation[0], anchorLocation[1])

  _openInfowindow : () ->
    that = @
    return ->
      # Close the latest selected marker before opening the current one.
      that.controller._closeVisibleInfoWindow()
      that.infowindow.open(that.getMap(), that.serviceObject)
      that.controller._setVisibleInfoWindow that.infowindow
  