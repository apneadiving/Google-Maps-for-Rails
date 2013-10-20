@Gmaps.Google.Builders.Marker = (markerClass, primitivesProvider)->

  class Marker extends markerClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options, internal_options)->
      new Marker(args, provider_options, internal_options)
  }
