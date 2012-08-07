@Gmaps4Rails.PolylineController =

  replacePolylines : (polylineData) ->
    #reset previous polylines and kill them from map
    @clearPolylines()
    #set new polylines
    @addPolylines(polylineData)
    #.... and adjust map boundaries
    @adjustMapToBounds()

  clearPolylines : ->
    for polyline in @polylines
      #delete polylines from map
      polyline.clear()
    #empty array
    @polylines = []

  #polylines is an array of arrays. It loops.
  addPolylines: (polylineData)->
    for polylineArgs in polylineData
      @polylines.push @createPolyline(polylineArgs)

  showPolylines : ->
    for polyline in @polylines
      polyline.show()

  hidePolylines : ->
    for polyline in @polylines
      polyline.hide()