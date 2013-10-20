@Gmaps.Primitives = (primitives)->

  delegator = (klass, args)->
    F = (args)-> klass.apply(this, args)
    F.prototype = klass.prototype
    new F(args)

  return {
    point: ->
      delegator(primitives.point, arguments)

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

  }
