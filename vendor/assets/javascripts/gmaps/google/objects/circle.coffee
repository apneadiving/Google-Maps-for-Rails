class @Gmaps.Google.Objects.Circle extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  # args:
  #   lat
  #   lng
  #   radius
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#CircleOptions
  constructor: (@args, @provider_options)->
    @serviceObject = @create_circle()
    @after_create()

  create_circle: ->
    new @PRIMITIVES.circle @circle_options()

  circle_options: ->
    base_options =
      center:   new @PRIMITIVES.latLng(@args.lat, @args.lng)
      radius:   @args.radius
    _.extend base_options, @provider_options

  updateBounds: (bounds)->
    bounds.extend(@getServiceObject().getBounds().getNorthEast())
    bounds.extend(@getServiceObject().getBounds().getSouthWest())
