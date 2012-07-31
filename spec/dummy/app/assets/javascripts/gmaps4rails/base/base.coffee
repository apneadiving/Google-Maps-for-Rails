class @Gmaps4Rails.Base extends Gmaps4Rails.Common

  @include Gmaps4Rails.BaseMethods
  @include Gmaps4Rails.Marker.Instance

  getMapObject: ->
    return @serviceObject

