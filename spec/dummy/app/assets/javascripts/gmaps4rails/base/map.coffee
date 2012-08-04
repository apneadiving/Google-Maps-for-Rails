@Gmaps4Rails.Map =

  DEFAULT_CONF:
    id: 'map'
    draggable: true
    detect_location: false  # should the browser attempt to use geolocation detection features of HTML5?
    center_on_user: false   # centers map on the location detected through the browser
    center_latitude: 0
    center_longitude: 0
    zoom: 7
    maxZoom: null
    minZoom: null
    auto_adjust : true      # adjust the map to the markers if set to true
    auto_zoom: true         # zoom given by auto-adjust
    bounds: []              # adjust map to these limits. Should be [{"lat": , "lng": }]
    raw: {}                  # raw json to pass additional options

  #to make the map fit the different LatLng points
  adjustToBounds : ->
    #FIRST_STEP: retrieve all bounds
    #create the bounds object only if necessary
    if @options.auto_adjust or @options.bounds.length > 0
      @boundsObject = @createLatLngBounds()

      #if autodjust is true, must get bounds from markers polylines etc...
      if @options.auto_adjust
        #from markers
        @extendBoundsWithMarkers()

        #from polylines:
        @extendBoundsWithPolylines()

        #from polygons:
        #@updateBoundsWithPolygons()

        #from circles
        #@updateBoundsWithCircles()

      #in every case, I've to take into account the bounds set up by the user
      @extendBounds()

      #SECOND_STEP: ajust the map to the bounds
      @adaptToBounds()