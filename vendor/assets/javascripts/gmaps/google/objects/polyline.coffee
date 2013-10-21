class @Gmaps.Google.Objects.Polyline extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (@serviceObject)->

  updateBounds: (bounds)->
    #even not provided by google...
