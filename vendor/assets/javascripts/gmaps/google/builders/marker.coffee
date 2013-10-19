@Gmaps.Google.Builders.Marker = (markerClass, primitivesProvider, cacheStore)->

  cacheStore.markerImages = []

  class Marker extends markerClass
    PRIMITIVES:  primitivesProvider
    CACHE_STORE: cacheStore

  return {
    build: (args, provider_options, internal_options)->
      new Marker(args, provider_options, internal_options)
  }
