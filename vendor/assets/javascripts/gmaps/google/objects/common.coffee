@Gmaps.Google.Objects.Common =

  clear: ()->
    @serviceObject.setMap(null)

  show: () ->
    @serviceObject.setVisible(true)

  hide: () ->
    @serviceObject.setVisible(false)

  isVisible: ->
    @serviceObject.getVisible()
