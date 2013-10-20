@Gmaps.Google.Objects.Common =

  getServiceObject: ->
    @serviceObject

  associate_to_map: (map)->
    @getServiceObject().setMap map

  addListener: (action, fn)->
    @PRIMITIVES.addListener @getServiceObject(), action, fn

  clear: ->
    @serviceObject.setMap(null)

  show: ->
    @serviceObject.setVisible(true)

  hide: ->
    @serviceObject.setVisible(false)

  isVisible: ->
    @serviceObject.getVisible()
