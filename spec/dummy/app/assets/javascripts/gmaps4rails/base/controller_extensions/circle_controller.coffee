@Gmaps4Rails.CircleController =

  #polygons is an array of arrays. It loops.
  addCircles: (circleData)->
    for circleArgs in circleData
      @circles.push @createCircle(circleArgs)

  replaceCircles : (circleData) ->
    #reset previous polylines and kill them from map
    @clearCircles()
    #set new polylines
    @addCircles(circleData)
    #.... and adjust map boundaries
    @adjustMapToBounds()

  clearCircles : ->
    for circle in @circles
      #delete polylines from map
      circle.clear()
    #empty array
    @circles = []

  showCircles : ->
    for circle in @circles
      circle.show()

  hideCircles : ->
    for circle in @circles
      circle.hide()
