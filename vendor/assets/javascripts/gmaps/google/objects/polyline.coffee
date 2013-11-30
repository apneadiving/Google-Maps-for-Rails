class @Gmaps.Google.Objects.Polyline extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (@serviceObject)->

  updateBounds: (bounds)->
    bounds.extend ll for ll in @serviceObject.getPath().getArray()
