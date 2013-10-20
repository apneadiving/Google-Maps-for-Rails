class @Gmaps.Google.Objects.Map extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (options, onMapLoad)->
    provider_options  = _.extend @default_options(), options.provider
    @internal_options = options.internal
    @serviceObject    = new @PRIMITIVES.map document.getElementById(@internal_options.id), provider_options
    @on_map_load onMapLoad

  centerOn: (position)->
    if _.isArray(position)
      point = new @PRIMITIVES.latLng position[0], position[1]
      @getServiceObject().setCenter(point)
    else
      @getServiceObject().setCenter(position)

  fitToBounds: (boundsObject)->
    @getServiceObject().fitBounds(boundsObject) unless boundsObject.isEmpty()

  on_map_load: (onMapLoad)->
    @PRIMITIVES.addListenerOnce @getServiceObject(), 'idle', onMapLoad

  default_options: ->
    {
      mapTypeId: @PRIMITIVES.mapTypes('ROADMAP') # HYBRID, ROADMAP, SATELLITE, TERRAIN
      center:    @PRIMITIVES.latLng(0, 0)
      zoom:      8
    }

