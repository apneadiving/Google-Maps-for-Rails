class @Gmaps.Google.Builders.Circle extends Gmaps.Objects.BaseBuilder

  # args:
  #   lat
  #   lng
  #   radius
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#CircleOptions
  constructor: (@args, @provider_options = {})->
    @serviceObject = @create_circle()

  create_circle: ->
    new @PRIMITIVES.circle @circle_options()

  circle_options: ->
    base_options =
      center:   new @PRIMITIVES.latLng(@args.lat, @args.lng)
      radius:   @args.radius
    _.defaults base_options, @provider_options
