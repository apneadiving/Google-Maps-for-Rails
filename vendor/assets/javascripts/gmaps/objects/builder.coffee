@Gmaps.Objects.Builders = (builderClass, objectClass, primitivesProvider)->

  return {
    build: (args, provider_options, internal_options)->
      objectClass.PRIMITIVES = primitivesProvider
      builderClass.OBJECT     = objectClass
      builderClass.PRIMITIVES = primitivesProvider

      builder = new builderClass(args, provider_options, internal_options)
      builder.build()
  }
