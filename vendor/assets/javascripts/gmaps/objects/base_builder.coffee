class @Gmaps.Objects.BaseBuilder

  build: ->
    new(@model_class())(@serviceObject)

  before_init: ->

  after_init: ->

  addListener: (action, fn)->
    @primitives().addListener @getServiceObject(), action, fn

  getServiceObject: ->
    @serviceObject

  primitives: ->
    @constructor.PRIMITIVES

  model_class: ->
    @constructor.OBJECT
