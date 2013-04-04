class @Gmaps4Rails.Yandex.Marker extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Marker

  @include Gmaps4Rails.Yandex.Shared
  @include Gmaps4Rails.Marker.Instance
  @extend  Gmaps4Rails.Marker.Class
  @extend  Gmaps4Rails.Configuration
  
  @CONF:
    infobox:  "description" #description or htmlContent

  constructor: (args, controller)->
    @controller = controller

    markerLatLng = @createLatLng(args.lat, args.lng)

    #// Marker sizes are expressed as a Size of X,Y
    @serviceObject = new ymaps.Placemark(markerLatLng, {
        balloonContent: @description,
        iconContent: "TEST"
        }
    );
    
    @_addToMap(@serviceObject)


  #cheap integration, I admit
  isVisible: ->
    true

  clear: ->
    @_removeFromMap(@serviceObject)

  show: ->
    @serviceObject.setOptions({ visible: true })

  hide: ->
    @serviceObject.setOptions({ visible: false })

  createInfoWindow : () ->
    @serviceObject.infoWindow = @description if @description?