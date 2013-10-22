class @Gmaps.Google.Builders.Kml extends Gmaps.Objects.BaseBuilder

  # args:
  #   url
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#KmlLayerOptions
  constructor: (@args, @provider_options = {})->
    @before_init()
    @serviceObject = @create_kml()
    @after_init()

  create_kml: ->
    new(@primitives().kml)(@args.url, @kml_options())

  kml_options: ->
    base_options = {}
    _.defaults base_options, @provider_options
