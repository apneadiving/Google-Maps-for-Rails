    @kml_options =
      clickable: true
      preserveViewport: false
      suppressInfoWindows: false

    #Polygon Styling
    @polygons_conf =         # default style for polygons
      strokeColor: "#FFAA00"
      strokeOpacity: 0.8
      strokeWeight: 2
      fillColor: "#000000"
      fillOpacity: 0.35
      clickable: false

    #Circle Styling
    @circles_conf =           #default style for circles
      fillColor: "#00AAFF"
      fillOpacity: 0.35
      strokeColor: "#FFAA00"
      strokeOpacity: 0.8
      strokeWeight: 2
      clickable: false
      zIndex: null

    #Direction Settings
    @direction_conf =
      panel_id:           null
      display_panel:      false
      origin:             null
      destination:        null
      waypoints:          []       #[{location: "toulouse,fr", stopover: true}, {location: "Clermont-Ferrand, fr", stopover: true}]
      optimizeWaypoints:  false
      unitSystem:         "METRIC" #IMPERIAL
      avoidHighways:      false
      avoidTolls:         false
      region:             null
      travelMode:         "DRIVING" #WALKING, BICYCLING


  #////////////////////////////////////////////////////
  #/////////////////        KML      //////////////////
  #////////////////////////////////////////////////////

  createKmlLayer : (kml) ->
    kml_options = kml.options || {}
    kml_options = @mergeObjectWithDefault(kml_options, @kml_options)
    kml =  new google.maps.KmlLayer( kml.url, kml_options)
    kml.setMap(@serviceObject)
    return kml

  #////////////////////////////////////////////////////
  #/////////////////// POLYLINES //////////////////////
  #////////////////////////////////////////////////////

  #creates a single polyline, triggered by create_polylines
  create_polyline : (polyline) ->
    polyline_coordinates = []

    #2 cases here, either we have a coded array of LatLng or we have an Array of LatLng
    for element in polyline
      #if we have a coded array
      if element.coded_array?
        decoded_array = new google.maps.geometry.encoding.decodePath(element.coded_array)
        #loop through every point in the array
        for point in decoded_array
          polyline_coordinates.push(point)

      #or we have an array of latlng
      else
        #by convention, a single polyline could be customized in the first array or it uses default values
        if element == polyline[0]
          strokeColor   = element.strokeColor   || @polylines_conf.strokeColor
          strokeOpacity = element.strokeOpacity || @polylines_conf.strokeOpacity
          strokeWeight  = element.strokeWeight  || @polylines_conf.strokeWeight
          clickable     = element.clickable     || @polylines_conf.clickable
          zIndex        = element.zIndex        || @polylines_conf.zIndex

        #add latlng if positions provided
        if element.lat? && element.lng?
          latlng = @createLatLng(element.lat, element.lng)
          polyline_coordinates.push(latlng)

    # Construct the polyline
    new_poly = new google.maps.Polyline
      path:         polyline_coordinates
      strokeColor:  strokeColor
      strokeOpacity: strokeOpacity
      strokeWeight: strokeWeight
      clickable:    clickable
      zIndex:       zIndex

    #save polyline
    polyline.serviceObject = new_poly
    new_poly.setMap(@serviceObject)

  
  updateBoundsWithPolylines: ()->
    for polyline in @polylines
      polyline_points = polyline.serviceObject.latLngs.getArray()[0].getArray()
      for point in polyline_points
        @boundsObject.extend point
  
  #////////////////////////////////////////////////////
  #/////////////////        KML      //////////////////
  #////////////////////////////////////////////////////

  create_kml : ->
    for kml in @kml
      kml.serviceObject = @createKmlLayer kml
