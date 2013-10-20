class @Gmaps.Google.Objects.Map extends Gmaps.Base

  constructor: (options, onMapLoad)->
    provider_options  = _.extend @default_options(), options.provider
    @internal_options = options.internal
    @serviceObject    = new @PRIMITIVES.map document.getElementById(@internal_options.id), provider_options
    @on_map_load onMapLoad

  # position can be:
  # - [ lat, lng]
  # - { lat: , lng: }
  # - a google.maps.LatLng
  centerOn: (position)->
    @getServiceObject().setCenter @PRIMITIVES.latLngFromPosition(position)

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

