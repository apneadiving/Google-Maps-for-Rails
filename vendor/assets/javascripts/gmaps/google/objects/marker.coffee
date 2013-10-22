class @Gmaps.Google.Objects.Marker extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (@serviceObject, @infowindow)->

  updateBounds: (bounds)->
    bounds.extend(@getServiceObject().position)

  panTo: ->
    @getServiceObject().getMap().panTo @getServiceObject().getPosition()
