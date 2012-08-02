class @Gmaps4Rails.Base extends Gmaps4Rails.Common

  @include Gmaps4Rails.BaseMethods
  @include Gmaps4Rails.Marker.Instance

  getMapObject: ->
    return @serviceObject

  #to make the map fit the different LatLng points
  adjustMapToBounds : ->
    #FIRST_STEP: retrieve all bounds
    #create the bounds object only if necessary
    if @map_options.auto_adjust or @map_options.bounds?
      @boundsObject = @createLatLngBounds()

      #if autodjust is true, must get bounds from markers polylines etc...
      if @map_options.auto_adjust
        #from markers
        @extendBoundsWithMarkers()

        #from polylines:
        #@updateBoundsWithPolylines()

        #from polygons:
        #@updateBoundsWithPolygons()

        #from circles
        #@updateBoundsWithCircles()

      #in every case, I've to take into account the bounds set up by the user
      @extendMapBounds()

      #SECOND_STEP: ajust the map to the bounds
      @adaptMapToBounds()