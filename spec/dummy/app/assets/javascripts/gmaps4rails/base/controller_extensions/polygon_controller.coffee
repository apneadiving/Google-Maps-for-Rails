@Gmaps4Rails.PolygonController =

  #polygons is an array of arrays. It loops.
  addPolygons: (polygonData)->
    for polygonArgs in polygonData
      @polygons.push @createPolygon(polygonArgs)

  replacePolygons : (polylineData) ->
    #reset previous polylines and kill them from map
    @clearPolygons()
    #set new polylines
    @addPolygons(polylineData)
    #.... and adjust map boundaries
    @adjustMapToBounds()

  clearPolygons : ->
    for polygon in @polygons
      #delete polylines from map
      polygon.clear()
    #empty array
    @polygons = []

  showPolygons : ->
    for polygon in @polygons
      polygon.show()

  hidePolygons : ->
    for polygon in @polygons
      polygon.hide()