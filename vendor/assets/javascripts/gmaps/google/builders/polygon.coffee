@Gmaps.Google.Builders.Polygon = (polygonClass, primitivesProvider)->

  class Polygon extends polygonClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options)->
      new Polygon(args, provider_options)
  }
