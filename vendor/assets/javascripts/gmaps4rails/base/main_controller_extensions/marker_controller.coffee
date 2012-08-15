@Gmaps4Rails.MarkerController =

  addMarkers: (markersData)->
    @clearClusterer() if @markerClusterer?

    for markerData, index in markersData
      #unless markerData.serviceObject?

      lat = markerData.lat
      lng = markerData.lng

      if @markers_conf.randomize
        latLng = @randomize(lat, lng)
        #retrieve coordinates from the array
        lat = latLng[0]
        lng = latLng[1]

      newMarker = @createMarker
        "marker_picture":   if markerData.picture  then markerData.picture else @markers_conf.picture
        "marker_width":     if markerData.width    then markerData.width   else @markers_conf.width
        "marker_height":    if markerData.height   then markerData.height  else @markers_conf.length
        "marker_title":     if markerData.title    then markerData.title   else null
        "marker_anchor":    if markerData.marker_anchor  then markerData.marker_anchor  else null
        "shadow_anchor":    if markerData.shadow_anchor  then markerData.shadow_anchor  else null
        "shadow_picture":   if markerData.shadow_picture then markerData.shadow_picture else null
        "shadow_width":     if markerData.shadow_width   then markerData.shadow_width   else null
        "shadow_height":    if markerData.shadow_height  then markerData.shadow_height  else null
        "marker_draggable": if markerData.draggable      then markerData.draggable      else @markers_conf.draggable
        "rich_marker":      if markerData.rich_marker    then markerData.rich_marker    else null
        "zindex":           if markerData.zindex         then markerData.zindex         else null
        "lat":              lat
        "lng":              lng
        "index":            index


      Gmaps4Rails.Common.mergeWith.call(newMarker, markerData)
      #add infowindowstuff if enabled
      newMarker.createInfoWindow()
      
      @markers.push newMarker

    @clusterize()

    #replace old markers with new markers on an existing map
  replaceMarkers : (new_markers) ->
    @clearMarkers()
    #reset previous markers
    @markers = []
    #reset current bounds
    @boundsObject = @createLatLngBounds()
    #add new markers
    @addMarkers(new_markers)

  #clear markers
  clearMarkers : ->
    @clearClusterer() if @markerClusterer?
    for marker in @markers
      marker.clear()
    @markers = []

  #show and hide markers
  showMarkers : ->
    for marker in @markers
      marker.show()

  hideMarkers : ->
    for marker in @markers
      marker.hide()

  randomize : (Lat0, Lng0) ->
    #distance in meters between 0 and max_random_distance (positive or negative)
    dx = @markers_conf.max_random_distance * @random()
    dy = @markers_conf.max_random_distance * @random()
    Lat = parseFloat(Lat0) + (180/Math.PI)*(dy/6378137)
    Lng = parseFloat(Lng0) + ( 90/Math.PI)*(dx/6378137)/Math.cos(Lat0)
    return [Lat, Lng]
