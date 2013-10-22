class @Gmaps.Google.Builders.Polyline extends Gmaps.Objects.BaseBuilder

  # args:
  #   [
  #     { lat, lng}
  #   ]
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#PolylineOptions
  constructor: (@args, @provider_options = {})->
    @before_init()
    @serviceObject = @create_polyline()
    @after_init()

  create_polyline: ->
    new(@primitives().polyline)(@polyline_options())

  polyline_options: ->
    base_options =
      path:  @_build_path()
    _.defaults base_options, @provider_options

  _build_path: ->
    _.map @args, (arg)=>
      new(@primitives().latLng)(arg.lat, arg.lng)
