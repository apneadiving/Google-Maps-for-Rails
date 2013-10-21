class @Gmaps.Google.Builders.Kml extends Gmaps.Objects.BaseBuilder

  # args:
  #   url
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#KmlLayerOptions
  constructor: (@args, @provider_options = {})->
    @serviceObject = @create_kml()

  create_kml: ->
    new @PRIMITIVES.kml( @args.url, @kml_options())

  kml_options: ->
    base_options = {}
    _.defaults @provider_options, base_options
