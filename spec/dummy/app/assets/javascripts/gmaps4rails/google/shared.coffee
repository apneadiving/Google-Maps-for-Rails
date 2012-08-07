Gmaps4Rails.GoogleShared = 
  
  createPoint : (lat, lng) ->
    return new google.maps.Point(lat, lng)
    
  createSize : (width, height) ->
    return new google.maps.Size(width, height)
  
  createLatLng : (lat, lng) ->
    return new google.maps.LatLng(lat, lng)

  createLatLngBounds : ->
    return new google.maps.LatLngBounds()

  clear: ()->
    @serviceObject.setMap(null)

  show: () ->
    @serviceObject.setVisible(true)

  hide: () ->
    @serviceObject.setVisible(false)