@Gmaps.Objects.Builders = (builderClass, objectClass, primitivesProvider)->

  objectClass.PRIMITIVES = primitivesProvider

  builderClass.OBJECT     = objectClass
  builderClass.PRIMITIVES = primitivesProvider

  return {
    build: (args, provider_options, internal_options)->
      builder = new builderClass(args, provider_options, internal_options)
      builder.build()
  }
