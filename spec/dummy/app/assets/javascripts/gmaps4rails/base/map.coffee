@Gmaps4Rails.Map =

  DEFAULT_MAP_OPTIONS:
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


  setMapOptions: ->
    if @MAP_OPTIONS?
      @mergeObjects(@MAP_OPTIONS, @DEFAULT_MAP_OPTIONS)
    else
      @DEFAULT_MAP_OPTIONS