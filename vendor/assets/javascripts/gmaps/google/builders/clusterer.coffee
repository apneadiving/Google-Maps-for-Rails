@Gmaps.Google.Builders.Clusterer = (clustererClass, primitivesProvider)->

  class Clusterer extends clustererClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, options)->
      new Clusterer(args, options)
  }
