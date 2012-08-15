Gmaps4Rails.Openlayers = {}

Gmaps4Rails.Openlayers.Shared = 

  createPoint:(lat, lng) ->
    new OpenLayers.Geometry.Point(lng, lat)
 
  createLatLng: (lat, lng)->
    new OpenLayers.LonLat(lng, lat).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")) # transform from WGS 1984 to Spherical Mercator Projection
              
  createAnchor: (offset)->
    return null if offset == null
    new OpenLayers.Pixel(offset[0], offset[1])

  createSize: (width, height)->
    new OpenLayers.Size(width, height)

  createLatLngBounds: ->
    new OpenLayers.Bounds()