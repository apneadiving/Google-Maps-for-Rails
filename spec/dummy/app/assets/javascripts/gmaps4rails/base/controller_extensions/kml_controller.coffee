@Gmaps4Rails.KmlController =

  addKml : (kmlData) ->
    for kml in kmlData
      @createKml kml