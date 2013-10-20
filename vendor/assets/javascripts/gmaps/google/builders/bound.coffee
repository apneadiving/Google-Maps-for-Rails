@Gmaps.Google.Builders.Bound = (boundClass, primitivesProvider)->

  class Bound extends boundClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args)->
      new Bound(args)
  }
