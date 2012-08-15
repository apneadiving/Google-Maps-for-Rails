class @Gmaps4Rails.Bing.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker

  @include Gmaps4Rails.Bing.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  
  @CONF:
    infobox:  "description" #description or htmlContent

  constructor: (args, controller)->
    @controller = controller

    markerLatLng = @createLatLng(args.lat, args.lng)
    anchorLatLng = @_createImageAnchorPosition([args.lat, args.lng])

    #// Marker sizes are expressed as a Size of X,Y
    if args.marker_picture?
      @serviceObject = new Microsoft.Maps.Pushpin(markerLatLng, {
        draggable: args.marker_draggable,
        anchor:    anchorLatLng,
        icon:      args.marker_picture,
        height:    args.marker_height,
        text:      args.marker_title,
        width:     args.marker_width
        }
      );
    else
      @serviceObject = new Microsoft.Maps.Pushpin(markerLatLng, {
        draggable: args.marker_draggable,
        anchor:    anchorLatLng,
        text:      args.marker_title
        }
      );

    @_addToMap(@serviceObject)


  #// creates infowindows
  createInfoWindow: () ->
    if @description?
      #//create the infowindow
      if @controller.markers_conf.infobox == "description"
        @info_window = new Microsoft.Maps.Infobox(@serviceObject.getLocation(), { description: @description, visible: false, showCloseButton: true})
      else
        @info_window = new Microsoft.Maps.Infobox(@serviceObject.getLocation(), { htmlContent: @description, visible: false})

      #//add the listener associated
      Microsoft.Maps.Events.addHandler(@serviceObject, 'click', @_openInfoWindow(@controller, @info_window))
      @_addToMap(@info_window)

  #cheap integration, I admit
  isVisible: ->
    true

  clear: ->
    @_removeFromMap(@serviceObject)

  show: ->
    @serviceObject.setOptions({ visible: true })

  hide: ->
    @serviceObject.setOptions({ visible: false })

  _openInfoWindow: (controller, infoWindow) ->
    return ->
      # Close the latest selected marker before opening the current one.
      if controller.visibleInfoWindow
        controller.visibleInfoWindow.setOptions({ visible: false })
      infoWindow.setOptions({ visible:true })
      controller.visibleInfoWindow = infoWindow

  #creates Image Anchor Position or return null if nothing passed
  _createImageAnchorPosition : (anchorLocation) ->
    return null unless anchorLocation?
    @createPoint(anchorLocation[0], anchorLocation[1])