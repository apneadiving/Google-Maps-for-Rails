class @Gmaps.Google.Objects.Bound extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  constructor: (options)->
    @serviceObject = new @PRIMITIVES.latLngBounds()

  extendWith: (array_or_object)->
    collection = if _.isArray(array_or_object) then array_or_object else [ array_or_object ]
    _.each collection, (object)=>
      object.updateBounds(@)

  extend: (value)->
    @getServiceObject().extend value

  # extendBoundsWithPolyline: (polyline)->
  #   polyline_points = polyline.serviceObject.latLngs.getArray()[0].getArray()
  #   for point in polyline_points
  #     @boundsObject.extend point

  # extendBoundsWithPolygon: (polygon)->
  #   polygon_points = polygon.serviceObject.latLngs.getArray()[0].getArray()
  #   for point in polygon_points
  #     @boundsObject.extend point
