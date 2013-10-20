@Gmaps.Google.Builders.Polyline = (polylineClass, primitivesProvider)->

  class Polyline extends polylineClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options)->
      new Polyline(args, provider_options)
  }
