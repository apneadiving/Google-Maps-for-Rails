class @Gmaps.Google.Builders.Polygon extends Gmaps.Objects.BaseBuilder

  # args:
  #   [
  #     { lat, lng}
  #   ]
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#PolygonOptions
  constructor: (@args, @provider_options = {})->
    @before_init()
    @serviceObject = @create_polygon()
    @after_init()

  create_polygon: ->
    new(@primitives().polygon)(@polygon_options())

  polygon_options: ->
    base_options =
      path:  @_build_path()
    _.defaults base_options, @provider_options

  _build_path: ->
    _.map @args, (arg)=>
      new(@primitives().latLng)(arg.lat, arg.lng)
