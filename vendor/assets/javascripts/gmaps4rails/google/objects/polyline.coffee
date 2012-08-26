class @Gmaps4Rails.Google.Polyline extends Gmaps4Rails.Common

  @include Gmaps4Rails.Interfaces.Basic

  @include Gmaps4Rails.Google.Shared
  @extend  Gmaps4Rails.Polyline.Class
  @extend  Gmaps4Rails.Configuration

 #creates a single polyline, triggered by create_polylines
  constructor : (polyline, controller) ->
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
          strokeColor   = element.strokeColor   || controller.polylines_conf.strokeColor
          strokeOpacity = element.strokeOpacity || controller.polylines_conf.strokeOpacity
          strokeWeight  = element.strokeWeight  || controller.polylines_conf.strokeWeight
          clickable     = element.clickable     || controller.polylines_conf.clickable
          zIndex        = element.zIndex        || controller.polylines_conf.zIndex
          icons         = element.icons         || controller.polylines_conf.icons

        #add latlng if positions provided
        if element.lat? && element.lng?
          polyline_coordinates.push @createLatLng(element.lat, element.lng)

    polyOptions = 
      path:          polyline_coordinates
      strokeColor:   strokeColor
      strokeOpacity: strokeOpacity
      strokeWeight:  strokeWeight
      clickable:     clickable
      zIndex:        zIndex
      icons:         icons

    mergedOptions = @mergeObjects controller.polylines_conf.raw, polyOptions

    # Construct the polyline
    @serviceObject = new google.maps.Polyline mergedOptions
    @serviceObject.setMap(controller.getMapObject())
