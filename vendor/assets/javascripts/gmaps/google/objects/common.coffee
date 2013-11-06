@Gmaps.Google.Objects.Common =

  getServiceObject: ->
    @serviceObject

  setMap: (map)->
    @getServiceObject().setMap map

  clear: ->
    @getServiceObject().setMap(null)

  show: ->
    @getServiceObject().setVisible(true)

  hide: ->
    @getServiceObject().setVisible(false)

  isVisible: ->
    @getServiceObject().getVisible()

  primitives: ->
    @constructor.PRIMITIVES
