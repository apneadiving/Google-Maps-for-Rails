@Gmaps.Google.Builders.Map = (mapClass, primitivesProvider)->

  class Map extends mapClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (options, onMapLoad)->
      new Map(options, onMapLoad)
  }
