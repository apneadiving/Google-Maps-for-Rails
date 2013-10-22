class @Gmaps.Google.Builders.Map extends Gmaps.Objects.BaseBuilder

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
      center:    @primitives().latLng(0, 0)
      zoom:      8
    }
