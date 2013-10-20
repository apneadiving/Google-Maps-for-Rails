@Gmaps.Google.Builders.Kml = (kmlClass, primitivesProvider)->

  class Kml extends kmlClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options)->
      new Kml(args, provider_options)
  }
