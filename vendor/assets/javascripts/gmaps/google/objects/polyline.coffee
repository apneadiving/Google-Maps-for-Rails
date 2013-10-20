class @Gmaps.Google.Objects.Polyline extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  # args:
  #   [
  #     { lat, lng}
  #   ]
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#PolylineOptions
  constructor: (@args, @provider_options)->
    @serviceObject = @create_polyline()
    @after_create()

  create_polyline: ->
    new @PRIMITIVES.polyline @polyline_options()

  polyline_options: ->
    base_options =
      path:  @_build_path()
    _.extend base_options, @provider_options

  _build_path: ->
    _.map @args, (arg)=>
      new @PRIMITIVES.latLng(arg.lat, arg.lng)

  updateBounds: (bounds)->
    #even not provided by google...
