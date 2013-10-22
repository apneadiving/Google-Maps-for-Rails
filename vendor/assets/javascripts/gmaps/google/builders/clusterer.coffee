class @Gmaps.Google.Builders.Clusterer extends Gmaps.Objects.BaseBuilder

  constructor: (@args, @options)->
    @before_init()
    @serviceObject = new(@primitives().clusterer)(@args.map, [], @options)
    @after_init()
