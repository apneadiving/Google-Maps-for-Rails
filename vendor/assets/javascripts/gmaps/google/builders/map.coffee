class @Gmaps.Google.Builders.Map extends Gmaps.Objects.BaseBuilder

  # options:
  #   internal:
  #     id: dom id of your map container
  #   provider: are any options from google: https://developers.google.com/maps/documentation/javascript/reference?hl=fr#MapOptions
  # onMapLoad is the callback triggered once map is loaded
  constructor: (options, onMapLoad)->
    @before_init()
    provider_options  = _.extend @default_options(), options.provider
    @internal_options = options.internal
    @serviceObject    = new(@primitives().map)(document.getElementById(@internal_options.id), provider_options)
    @on_map_load onMapLoad
    @after_init()

  build: ->
    new(@model_class())(@serviceObject, @primitives())

  on_map_load: (onMapLoad)->
    @primitives().addListenerOnce @serviceObject, 'idle', onMapLoad

  default_options: ->
    {
      mapTypeId: @primitives().mapTypes('ROADMAP') # HYBRID, ROADMAP, SATELLITE, TERRAIN
      center:    new(@primitives().latLng)(0, 0)
      zoom:      8
    }
