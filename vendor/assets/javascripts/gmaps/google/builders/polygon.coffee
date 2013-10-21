class @Gmaps.Google.Builders.Polygon extends Gmaps.Objects.BaseBuilder

  # args:
  #   [
  #     { lat, lng}
  #   ]
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#PolygonOptions
  constructor: (@args, @provider_options = {})->
    @serviceObject = @create_polygon()

  create_polygon: ->
    new @PRIMITIVES.polygon @polygon_options()

  polygon_options: ->
    base_options =
      path:  @_build_path()
    _.defaults base_options, @provider_options

  _build_path: ->
    _.map @args, (arg)=>
      new @PRIMITIVES.latLng(arg.lat, arg.lng)
