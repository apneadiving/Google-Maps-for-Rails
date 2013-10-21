@Gmaps.Objects.Builders = (builderClass, objectClass, primitivesProvider)->

  class Builder extends builderClass
    OBJECT:      objectClass
    PRIMITIVES:  primitivesProvider

  return {
    build: (args, provider_options, internal_options)->
      new Builder(args, provider_options, internal_options).build()
  }
