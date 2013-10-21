class @Gmaps.Google.Builders.Clusterer extends Gmaps.Objects.BaseBuilder

  constructor: (@args, @options)->
    @serviceObject = new @PRIMITIVES.clusterer(@args.map, [], @options)
