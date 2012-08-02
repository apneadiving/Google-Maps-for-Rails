@Gmaps4Rails.Marker = { } 

@Gmaps4Rails.Marker.Class =

  DEFAULT_MARKER_CONF:
    #Marker config
    title: null
    #MarkerImage config
    picture : null
    width: 22
    length: 32
    draggable: false         # how to modify: <%= gmaps( "markers" => { "data" => @object.to_gmaps4rails, "options" => { "draggable" => true }}) %>
    #clustering config
    do_clustering: false     # do clustering if set to true
    randomize: false         # Google maps can't display two markers which have the same coordinates. This randomizer enables to prevent this situation from happening.
    max_random_distance: 100 # in meters. Each marker coordinate could be altered by this distance in a random direction
    list_container: null     # id of the ul that will host links to all markers
    offset: 0                # used when adding_markers to an existing map. Because new markers are concated with previous one, offset is here to prevent the existing from being re-created.
    raw: {}                  # raw json to pass additional options

  setMarkersConf: ->
    if @CONF
      @mergeObjects(@CONF, @DEFAULT_MARKER_CONF)
    else
      @DEFAULT_MARKER_CONF


@Gmaps4Rails.Marker.Instance =

  addMarkers: (markersData)->

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
      
      #create sidebar if enabled
      #@createSidebar(@markers[index])
      #@clusterize()
      #     #add infowindowstuff if enabled
      #     @createInfoWindow(@markers[index])
      #     #create sidebar if enabled
      #     @createSidebar(@markers[index])
      # 
      # @markers_conf.offset = @markers.length

      @markers.push newMarker


  randomize : (Lat0, Lng0) ->
    #distance in meters between 0 and max_random_distance (positive or negative)
    dx = @markers_conf.max_random_distance * @random()
    dy = @markers_conf.max_random_distance * @random()
    Lat = parseFloat(Lat0) + (180/Math.PI)*(dy/6378137)
    Lng = parseFloat(Lng0) + ( 90/Math.PI)*(dx/6378137)/Math.cos(Lat0)
    return [Lat, Lng]

