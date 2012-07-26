class @Gmaps4Rails.GoogleMarker extends Gmaps4Rails.Common

  @include Gmaps4Rails.GoogleShared
  @extend  Gmaps4Rails.Marker
  #markers + info styling
  CONF =
    clusterer_gridSize:      50
    clusterer_maxZoom:       5
    custom_cluster_pictures: null
    custom_infowindow_class: null
    raw:                     {}


  @setMarkersConf: ->
    @mergeObjectWithDefault(@CONF, @DEFAULT_MAP_OPTIONS)
  #  @mergeWithDefault("markers_conf")

    
  constructor: (args, map)->

    for name, value in args
      @[name] = value
    
    markerLatLng = @createLatLng(args.lat, args.lng)
    #Marker sizes are expressed as a Size of X,Y
    #if args.marker_picture == "" and args.rich_marker == null
    defaultOptions = {position: markerLatLng, map: map, title: args.marker_title, draggable: args.marker_draggable, zIndex: args.zindex}
    #mergedOptions  = @mergeObjectWithDefault CONF.raw, defaultOptions
    #return new google.maps.Marker mergedOptions
    @serviceObject = new google.maps.Marker defaultOptions

    # if (args.rich_marker != null)
    #   console.log args
    #   return new RichMarker({
    #     position: markerLatLng
    #     map:       @serviceObject
    #     draggable: args.marker_draggable
    #     content:   args.rich_marker
    #     flat:      if args.marker_anchor == null then false else args.marker_anchor[1]
    #     anchor:    if args.marker_anchor == null then 0     else args.marker_anchor[0]
    #     zIndex:    args.zindex
    #   })

    #default behavior
    #calculate MarkerImage anchor location
    # imageAnchorPosition  = @createImageAnchorPosition args.marker_anchor
    # shadowAnchorPosition = @createImageAnchorPosition args.shadow_anchor
    # #create or retrieve existing MarkerImages
    # markerImage = @createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition)
    # shadowImage = @createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition)
    # defaultOptions = {position: markerLatLng, map: @serviceObject, icon: markerImage, title: args.marker_title, draggable: args.marker_draggable, shadow: shadowImage,  zIndex: args.zindex}
    # mergedOptions  = @mergeObjectWithDefault CONF.raw, defaultOptions
    # return new google.maps.Marker mergedOptions
    
    # @latLng = @createLatLng(args.Lat, args.Lng)
    #     @map = args.map
    #     @title     = args.marker_title
    #     @draggable = args.draggable
    #     @zIndex    = args.zindex
    # 
    #     @anchor = args.marker_anchor    
    #     @width  = args.marker_width
    #     @height = args.marker_height 
    #     
    #     @shadowAnchor = args.shadow_anchor
    #     @shadowHeight = args.shadow_height
    #     @shadowWidth  = args.shadow_width
    #     
    #     @marker_picture = args.marker_picture
    #     
    #     @richMarker    = args.rich_marker
    #     
    #     @latLng = @createLatLng(, args.Lng)
  
  # createMarker : (args) ->
  #   markerLatLng = 
  #   #Marker sizes are expressed as a Size of X,Y
  #   if args.marker_picture == "" and args.rich_marker == null
  #     defaultOptions = {position: markerLatLng, map: @serviceObject, title: args.marker_title, draggable: args.marker_draggable, zIndex: args.zindex}
  #     mergedOptions  = @mergeObjectWithDefault CONF.raw, defaultOptions
  #     return new google.maps.Marker mergedOptions
  # 
  #   if (args.rich_marker != null)
  #     return new RichMarker({
  #       position: markerLatLng
  #       map:       @serviceObject
  #       draggable: args.marker_draggable
  #       content:   args.rich_marker
  #       flat:      if args.marker_anchor == null then false else args.marker_anchor[1]
  #       anchor:    if args.marker_anchor == null then 0     else args.marker_anchor[0]
  #       zIndex:    args.zindex
  #     })
  # 
  #   #default behavior
  #   #calculate MarkerImage anchor location
  #   imageAnchorPosition  = @createImageAnchorPosition args.marker_anchor
  #   shadowAnchorPosition = @createImageAnchorPosition args.shadow_anchor
  #   #create or retrieve existing MarkerImages
  #   markerImage = @createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition)
  #   shadowImage = @createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition)
  #   defaultOptions = {position: markerLatLng, map: @serviceObject, icon: markerImage, title: args.marker_title, draggable: args.marker_draggable, shadow: shadowImage,  zIndex: args.zindex}
  #   mergedOptions  = @mergeObjectWithDefault CONF.raw, defaultOptions
  #   return new google.maps.Marker mergedOptions

  #checks if obj is included in arr Array and returns the position or false
  includeMarkerImage : (arr, obj) ->
    console.log arr, obj
    for object, index in arr
      return index if object.url == obj
    return false

  #checks if MarkerImage exists before creating a new one
  #returns a MarkerImage or false if ever something wrong is passed as argument
  createOrRetrieveImage : (currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition) ->
    return null if (typeof(currentMarkerPicture) == "undefined" or currentMarkerPicture == "" or currentMarkerPicture == null )

    test_image_index = @includeMarkerImage(@markerImages, currentMarkerPicture)
    switch test_image_index
      when false
        markerImage = @createMarkerImage(currentMarkerPicture, @createSize(markerWidth, markerHeight), null, imageAnchorPosition, null )
        @markerImages.push(markerImage)
        return markerImage
        break
      else
        return @markerImages[test_image_index] if typeof test_image_index == 'number'
        return false

  clear: () ->
    @serviceObject.setMap(null)

  show: () ->
    @serviceObject.setVisible(true)

  hide: () ->
    @serviceObject.setVisible(false)

  extendBoundsWithMarkers : ->
    for marker in @markers
      @boundsObject.extend(marker.serviceObject.position)

  
  createMarkerImage : (markerPicture, markerSize, origin, anchor, scaledSize) ->
    return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize)
    
  #////////////////////////////////////////////////////
  #/////////////////// INFO WINDOW ////////////////////
  #////////////////////////////////////////////////////

  #// creates infowindows
  createInfoWindow : () ->
    # if typeof(@jsTemplate) == "function" or @description?
    #   @description = @jsTemplate(@) if typeof(@jsTemplate) == "function"
    #   if CONF.custom_infowindow_class != null
    #     #creating custom infowindow
    #     boxText = document.createElement("div")
    #     boxText.setAttribute("class", CONF.custom_infowindow_class) #to customize
    #     boxText.innerHTML = @description
    #     @infowindow = new InfoBox(@infobox(boxText))
    #     google.maps.event.addListener(@serviceObject, 'click', @openInfoWindow(@map, @infowindow, @serviceObject))
    #   else
    #     #create default infowindow
    #     @infowindow = new google.maps.InfoWindow({content: @description })
    #     #add the listener associated
    #     google.maps.event.addListener(@serviceObject, 'click', @openInfoWindow(@map, @infowindow, @serviceObject))

  openInfoWindow : () ->
    return ->
      # Close the latest selected marker before opening the current one.
      @map.visibleInfoWindow.close() if @map.visibleInfoWindow != null
      @infowindow.open(@map.serviceObject, @serviceObject)
      @map.visibleInfoWindow = @infowindow

  createImageAnchorPosition : (anchorLocation) ->
    if (typeof(anchorLocation) == "undefined" or anchorLocation == null)
      return null
    else
      return @createPoint(anchorLocation[0], anchorLocation[1])

  mergeObjectWithDefault : (object1, object2) ->
    copy_object1 = {}
    for key, value of object1
      copy_object1[key] = value

    for key, value of object2
      unless copy_object1[key]?
        copy_object1[key] = value
    return copy_object1

  mergeWithDefault : (objectName) ->
    default_object = @["default_" + objectName]
    object = @[objectName]
    @[objectName] = @mergeObjectWithDefault(object, default_object)
    return true
  