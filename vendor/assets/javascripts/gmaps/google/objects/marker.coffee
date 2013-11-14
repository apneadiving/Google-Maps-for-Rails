class @Gmaps.Google.Objects.Marker extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  # @infowindow is set later, once marker is clicked
  constructor: (@serviceObject)->

  updateBounds: (bounds)->
    bounds.extend(@getServiceObject().position)

  panTo: ->
    @getServiceObject().getMap().panTo @getServiceObject().getPosition()
