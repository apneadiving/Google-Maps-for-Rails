@Gmaps.Primitives = (primitives)->

  delegator = (klass, args)->
    F = (args)-> klass.apply(this, args)
    F.prototype = klass.prototype
    new F(args)

  return {
    point: ->
      delegator(primitives.point, arguments)

    polyline: ->
      delegator(primitives.polyline, arguments)

    polygon: ->
      delegator(primitives.polygon, arguments)

    size: ->
      delegator(primitives.size, arguments)

    latLng: ->
      delegator(primitives.latLng, arguments)

    latLngBounds: ->
      delegator(primitives.latLngBounds, arguments)

    map: ->
      delegator(primitives.map, arguments)

    circle: ->
      delegator(primitives.circle, arguments)

    mapTypes: (type)->
      primitives.mapTypes[type]

    addListener: (object, event_name, fn)->
      primitives.addListener object, event_name, fn

    addListenerOnce: (object, event_name, fn)->
      primitives.addListenerOnce object, event_name, fn

    marker: ->
      delegator(primitives.marker, arguments)

    markerImage: ->
      delegator(primitives.markerImage, arguments)

    infowindow: ->
      delegator(primitives.infowindow, arguments)

    clusterer: ->
      delegator(primitives.clusterer, arguments)

    kml: ->
      delegator(primitives.kml, arguments)

    # position can be:
    # - [ lat, lng]
    # - { lat: , lng: }
    # - a google.maps.LatLng
    latLngFromPosition: (position)->
      if _.isArray(position)
        return new primitives.latLng position[0], position[1]
      else
        if _.isNumber(position.lat) and _.isNumber(position.lng)
          return new primitives.latLng position.lat, position.lng
        else
          position

  }
