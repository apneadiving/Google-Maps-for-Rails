@Gmaps.Google.Objects.Common =

  getServiceObject: ->
    @serviceObject

  associate_to_map: (map)->
    @getServiceObject().setMap map

  clear: ->
    @serviceObject.setMap(null)
    @serviceObject = null

  show: ->
    @serviceObject.setVisible(true)

  hide: ->
    @serviceObject.setVisible(false)

  isVisible: ->
    @serviceObject.getVisible()
