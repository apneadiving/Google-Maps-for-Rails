@Gmaps.Google.Builders.Clusterer = (clustererClass, primitivesProvider)->

  class Clusterer extends clustererClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options)->
      new Clusterer(args, provider_options)
  }
