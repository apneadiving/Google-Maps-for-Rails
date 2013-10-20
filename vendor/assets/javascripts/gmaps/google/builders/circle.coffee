@Gmaps.Google.Builders.Circle = (circleClass, primitivesProvider)->

  class Circle extends circleClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options)->
      new Circle(args, provider_options)
  }
