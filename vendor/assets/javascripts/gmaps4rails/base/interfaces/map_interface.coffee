Gmaps4Rails.Interfaces ||= {}

Gmaps4Rails.Interfaces.Map = 

  extendBoundsWithMarker : (marker) ->
    throw "extendBoundsWithMarker should be implemented in controller"

  extendBoundsWithPolyline: (polyline)->
    throw "extendBoundsWithPolyline should be implemented in controller"

  extendBoundsWithPolygon: (polygon)->
    throw "extendBoundsWithPolygon should be implemented in controller"

  extendBoundsWithCircle: (circle)->
    throw "extendBoundsWithCircle should be implemented in controller"

  extendBound: (bound)->
    throw "extendBound should be implemented in controller"

  adaptToBounds:()->
    throw "adaptToBounds should be implemented in controller"

  fitBounds : ->
    throw "fitBounds should be implemented in controller"

  centerMapOnUser : (position)->
    throw "centerMapOnUser should be implemented in controller"
