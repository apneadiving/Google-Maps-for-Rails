@Gmaps.Google.Objects.Common =

  after_create: ->

  getServiceObject: ->
    @serviceObject

  associate_to_map: (map)->
    @getServiceObject().setMap map

  addListener: (action, fn)->
    @PRIMITIVES.addListener @getServiceObject(), action, fn

  clear: ->
    @serviceObject.setMap(null)
    @serviceObject = null

  show: ->
    @serviceObject.setVisible(true)

  hide: ->
    @serviceObject.setVisible(false)

  isVisible: ->
    @serviceObject.getVisible()
