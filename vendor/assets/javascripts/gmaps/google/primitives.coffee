@Gmaps.Google.Primitives = ->
  factory = {
    point:        google.maps.Point
    size:         google.maps.Size
    circle:       google.maps.Circle
    latLng:       google.maps.LatLng
    latLngBounds: google.maps.LatLngBounds
    map:          google.maps.Map
    mapTypez:     google.maps.MapTypeId
    markerImage:  google.maps.MarkerImage
    marker:       google.maps.Marker
    infowindow:   google.maps.InfoWindow
    listener:     google.maps.event.addListener
    clusterer:    MarkerClusterer
    listenerOnce: google.maps.event.addListenerOnce
    polyline:     google.maps.Polyline
    polygon:      google.maps.Polygon
    kml:          google.maps.KmlLayer

    addListener: (object, event_name, fn)->
      factory.listener object, event_name, fn

    addListenerOnce: (object, event_name, fn)->
      factory.listenerOnce object, event_name, fn

    mapTypes: (type)->
      factory.mapTypez[type]

    # position can be:
    # - [ lat, lng]
    # - { lat: , lng: }
    # - a google.maps.LatLng
    latLngFromPosition: (position)->
      if _.isArray(position)
        return new factory.latLng(position[0], position[1])
      else
        if _.isNumber(position.lat) and _.isNumber(position.lng)
          return new factory.latLng(position.lat, position.lng)
        else
          position
  }

  factory
