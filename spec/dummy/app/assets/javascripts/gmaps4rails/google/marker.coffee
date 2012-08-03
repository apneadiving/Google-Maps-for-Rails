class @Gmaps4Rails.GoogleMarker extends Gmaps4Rails.Common

  @include Gmaps4Rails.GoogleShared
  @extend  Gmaps4Rails.Marker.Class

  #markers + info styling
  CONF =
    clusterer_gridSize:      50
    clusterer_maxZoom:       5
    custom_cluster_pictures: null
    custom_infowindow_class: null
    raw:                     {}
  
  isBasicMarker: (args)->
    !args.marker_picture? and !args.rich_marker?

  getMap: ->
    @controller.getMapObject()

  constructor: (args, controller)->
    @controller = controller
    @markerImages = []

    markerLatLng = @createLatLng(args.lat, args.lng)
    #Marker sizes are expressed as a Size of X,Y
    if @isBasicMarker(args)
      defaultOptions = {position: markerLatLng, map: @getMap(), title: args.marker_title, draggable: args.marker_draggable, zIndex: args.zindex}
      mergedOptions  = @mergeObjects CONF.raw, defaultOptions
      @serviceObject = new google.maps.Marker defaultOptions
      return

    if args.rich_marker?    
      return new RichMarker({
        position: markerLatLng
        map:       @serviceObject
        draggable: args.marker_draggable
        content:   args.rich_marker
        flat:      if args.marker_anchor == null then false else args.marker_anchor[1]
        anchor:    if args.marker_anchor == null then 0     else args.marker_anchor[0]
        zIndex:    args.zindex
      })

    #default behavior
    #calculate MarkerImage anchor location
    imageAnchorPosition  = @createImageAnchorPosition args.marker_anchor
    shadowAnchorPosition = @createImageAnchorPosition args.shadow_anchor
    #create or retrieve existing MarkerImages
    markerImage = @createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition)
    shadowImage = @createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition)
    defaultOptions = {position: markerLatLng, map: @getMap(), icon: markerImage, title: args.marker_title, draggable: args.marker_draggable, shadow: shadowImage,  zIndex: args.zindex}
    mergedOptions  = @mergeObjects CONF.raw, defaultOptions
    @serviceObject = new google.maps.Marker mergedOptions
    

  #checks if obj is included in arr Array and returns the position or false
  includeMarkerImage : (obj) ->
    for object, index in @controller.markerImages
      return index if object.url == obj
    return false

  #checks if MarkerImage exists before creating a new one
  #returns a MarkerImage or false if ever something wrong is passed as argument
  createOrRetrieveImage : (currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition) ->
    return null if (typeof(currentMarkerPicture) == "undefined" or currentMarkerPicture == "" or currentMarkerPicture == null )

    if !(test_image_index = @includeMarkerImage(currentMarkerPicture))
      markerImage = @createMarkerImage(currentMarkerPicture, @createSize(markerWidth, markerHeight), null, imageAnchorPosition, null )
      @controller.markerImages.push(markerImage)
      return markerImage
    else
      return @controller.markerImages[test_image_index] if typeof test_image_index == 'number'
      return false

  clear: () ->
    @serviceObject.setMap(null)

  show: () ->
    @serviceObject.setVisible(true)

  hide: () ->
    @serviceObject.setVisible(false)

  
  createMarkerImage : (markerPicture, markerSize, origin, anchor, scaledSize) ->
    return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize)
    
  #////////////////////////////////////////////////////
  #/////////////////// INFO WINDOW ////////////////////
  #////////////////////////////////////////////////////

  #// creates infowindows
  createInfoWindow : () ->
    if typeof(@controller.jsTemplate) == "function" or @description?
      @description = @controller.jsTemplate(@) if typeof(@controller.jsTemplate) == "function"
      if CONF.custom_infowindow_class?
        #creating custom infowindow
        boxText = document.createElement("div")
        boxText.setAttribute("class", CONF.custom_infowindow_class) #to customize
        boxText.innerHTML = @description
        @infowindow = new InfoBox(@infobox(boxText))
        google.maps.event.addListener(@serviceObject, 'click', @_openInfowindow())
      else
        #create default infowindow
        @infowindow = new google.maps.InfoWindow({content: @description })
        #add the listener associated
        google.maps.event.addListener(@serviceObject, 'click', @_openInfowindow())

  #creates Image Anchor Position or return null if nothing passed
  createImageAnchorPosition : (anchorLocation) ->
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
  