class @Gmaps4Rails.Yandex.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker

  @include Gmaps4Rails.Yandex.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  
  constructor: (args, controller)->
    @controller = controller

    markerLatLng = @createLatLng(args.lat, args.lng)

    @serviceObject = new ymaps.Placemark(markerLatLng, {
        balloonContent: @description,
        iconContent: @iconContent
        },
        {
            iconImageHref: args.marker_picture,
            iconImageSize: [args.marker_width, args.marker_height], 
            iconImageOffset: args.marker_anchor
        }
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
