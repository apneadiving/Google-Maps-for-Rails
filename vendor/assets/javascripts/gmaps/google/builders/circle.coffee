class @Gmaps.Google.Builders.Circle extends Gmaps.Objects.BaseBuilder

  # args:
  #   lat
  #   lng
  #   radius
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#CircleOptions
  constructor: (@args, @provider_options = {})->
    @before_init()
    @serviceObject = @create_circle()
    @after_init()

  create_circle: ->
    new(@primitives().circle)(@circle_options())

  circle_options: ->
    base_options =
      center:   new(@primitives().latLng)(@args.lat, @args.lng)
      radius:   @args.radius
    _.defaults base_options, @provider_options
