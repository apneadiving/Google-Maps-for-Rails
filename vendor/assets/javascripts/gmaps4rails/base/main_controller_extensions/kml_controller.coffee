@Gmaps4Rails.KmlController =

  addKml : (kmlData) ->
    for kml in kmlData
      @kmls.push @createKml kml