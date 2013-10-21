class @Gmaps.Google.Builders.Map extends Gmaps.Objects.BaseBuilder

  constructor: (options, onMapLoad)->
    provider_options  = _.extend @default_options(), options.provider
    @internal_options = options.internal
    @serviceObject    = new @PRIMITIVES.map document.getElementById(@internal_options.id), provider_options
    @on_map_load onMapLoad

  on_map_load: (onMapLoad)->
    @PRIMITIVES.addListenerOnce @serviceObject, 'idle', onMapLoad

  default_options: ->
    {
      mapTypeId: @PRIMITIVES.mapTypes('ROADMAP') # HYBRID, ROADMAP, SATELLITE, TERRAIN
      center:    @PRIMITIVES.latLng(0, 0)
      zoom:      8
    }
