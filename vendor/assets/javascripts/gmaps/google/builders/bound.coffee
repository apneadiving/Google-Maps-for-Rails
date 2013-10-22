class @Gmaps.Google.Builders.Bound extends Gmaps.Objects.BaseBuilder

  constructor: (options)->
    @before_init()
    @serviceObject = new(@primitives().latLngBounds)
    @after_init()
