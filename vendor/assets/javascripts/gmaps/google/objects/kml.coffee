class @Gmaps.Google.Objects.Kml extends Gmaps.Base

  # args:
  #   url
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#KmlLayerOptions
  constructor: (@args, @provider_options)->
    @serviceObject = @create_kml()
    @after_create()

  create_kml: ->
    new @PRIMITIVES.kml( @args.url, @kml_options())

  kml_options: ->
    base_options = {}
    _.extend base_options, @provider_options

  updateBounds: (bounds)->
    #even not provided by google...
