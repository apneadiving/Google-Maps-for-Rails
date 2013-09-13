class @Gmaps4Rails.Yandex.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker

  @include Gmaps4Rails.Yandex.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  
  constructor: (args, controller)->
    @controller = controller

    markerLatLng = @createLatLng(args.lat, args.lng)
   
    @style_mark = {}
    if args.marker_picture? 
      @_styleForCustomMarker(args)

    @serviceObject = new ymaps.Placemark(markerLatLng, {
        balloonContent: @description,
        iconContent: args.marker_title
        },
        @style_mark
    );
    
    @_addToMap(@serviceObject)


  #cheap integration, I admit
  isVisible: ->
    true

  clear: ->
    @_removeFromMap(@serviceObject)

  show: ->
    @serviceObject.options.set("visible", true)

  hide: ->
    @serviceObject.options.set("visible", false)

  createInfoWindow : () ->
    @serviceObject.properties.set("balloonContent", @description) if @description?

  _styleForCustomMarker: (args)->
    @style_mark.iconImageHref = args.marker_picture
    @style_mark.iconImageSize    = [args.marker_width, args.marker_height]
    #//adding anchor if any
    if args.marker_anchor?
      @style_mark.iconImageOffset = args.marker_anchor
    #//adding shadow if any
    if args.shadow_picture?
      @style_mark.iconShadow = true
      @style_mark.iconShadowImageHref = args.shadow_picture
      @style_mark.iconShadowImageSize = [args.shadow_width, args.shadow_height]
      #//adding shadow's height/width
      if args.shadow_width? and  args.shadow_height?
        @style_mark.iconShadowOffset = [args.shadow_width, args.shadow_height]
      #//adding shadow's anchor if any
      if args.shadow_anchor?
        @style_mark.iconShadowOffset = args.shadow_anchor
        