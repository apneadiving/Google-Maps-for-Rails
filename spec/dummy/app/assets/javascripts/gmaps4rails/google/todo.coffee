    @kml_options =
      clickable: true
      preserveViewport: false
      suppressInfoWindows: false



  #////////////////////////////////////////////////////
  #/////////////////        KML      //////////////////
  #////////////////////////////////////////////////////

  createKmlLayer : (kml) ->
    kml_options = kml.options || {}
    kml_options = @mergeObjects(kml_options, @kml_options)
    kml =  new google.maps.KmlLayer( kml.url, kml_options)
    kml.setMap(@serviceObject)
    return kml


  create_kml : ->
    for kml in @kml
      kml.serviceObject = @createKmlLayer kml
