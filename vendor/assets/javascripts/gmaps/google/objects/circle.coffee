class @Gmaps.Google.Objects.Circle extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (@serviceObject)->

  updateBounds: (bounds)->
    bounds.extend(@getServiceObject().getBounds().getNorthEast())
    bounds.extend(@getServiceObject().getBounds().getSouthWest())
