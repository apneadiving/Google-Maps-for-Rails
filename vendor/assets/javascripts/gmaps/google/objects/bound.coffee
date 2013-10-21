class @Gmaps.Google.Objects.Bound extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (@serviceObject)->

  extendWith: (array_or_object)->
    collection = if _.isArray(array_or_object) then array_or_object else [ array_or_object ]
    _.each collection, (object)=>
      object.updateBounds(@)

  extend: (value)->
    @getServiceObject().extend value
