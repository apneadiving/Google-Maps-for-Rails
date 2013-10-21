class @Gmaps.Objects.BaseBuilder

  build: ->
    new @OBJECT(@serviceObject)

  addListener: (action, fn)->
    @PRIMITIVES.addListener @getServiceObject(), action, fn

  getServiceObject: ->
    @serviceObject
