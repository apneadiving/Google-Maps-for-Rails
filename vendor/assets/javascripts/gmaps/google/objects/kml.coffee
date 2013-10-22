class @Gmaps.Google.Objects.Kml extends Gmaps.Base

  constructor: (@serviceObject)->

  updateBounds: (bounds)->
    #even not provided by google...

  setMap: (map)->
    @getServiceObject().setMap map

  getServiceObject: ->
    @serviceObject

  primitives: ->
    @constructor.PRIMITIVES
