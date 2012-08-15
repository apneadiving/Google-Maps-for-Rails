Gmaps4Rails.Google = {}

Gmaps4Rails.Google.Shared = 
  
  createPoint : (lat, lng) ->
    new google.maps.Point(lat, lng)
    
  createSize : (width, height) ->
    new google.maps.Size(width, height)
  
  createLatLng : (lat, lng) ->
    new google.maps.LatLng(lat, lng)

  createLatLngBounds : ->
    new google.maps.LatLngBounds()

  clear: ()->
    @serviceObject.setMap(null)

  show: () ->
    @serviceObject.setVisible(true)

  hide: () ->
    @serviceObject.setVisible(false)

  isVisible: ->
    @serviceObject.getVisible()