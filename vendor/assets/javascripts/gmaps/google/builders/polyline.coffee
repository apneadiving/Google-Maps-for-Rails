class @Gmaps.Google.Builders.Polyline extends Gmaps.Objects.BaseBuilder

  # args:
  #   [
  #     { lat, lng}
  #   ]
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#PolylineOptions
  constructor: (@args, @provider_options = {})->
    @serviceObject = @create_polyline()

  create_polyline: ->
    new @PRIMITIVES.polyline @polyline_options()

  polyline_options: ->
    base_options =
      path:  @_build_path()
    _.defaults base_options, @provider_options

  _build_path: ->
    _.map @args, (arg)=>
      new @PRIMITIVES.latLng(arg.lat, arg.lng)
