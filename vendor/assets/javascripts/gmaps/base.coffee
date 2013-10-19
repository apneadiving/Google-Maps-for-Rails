#= require_self
#= require_tree './base'
#= require_tree './objects'

# Gmaps.map = Gmaps.Builders.Map.build(type, options, callbacks)

# Gmaps.map.addMarkers(markers, options, callbacks)

# for each marker
#   Gmaps.Builders.Marker.build(type, options, callbacks)

@Gmaps =

  build: (type)->
    new Gmaps.Objects.Handler(type)

  Builders: {}
  Objects:  {}

  Google:
    Objects:  {}
    Builders: {}


# handler = Gmaps.build 'Google'
# handler.buildMap { provider: {}, internal: {id: 'map'}}, ->
#   handler.addMarker({ lat: 0, lng: 0 }, {})

# handler = Gmaps.build('Google')

# handler.buildMap({ provider: {}, internal: {id: 'map'}}, function(){
#   handler.addMarker({ lat: 0, lng: 0 }, {});
# })
#   handler.addMarker({ lat: 0, lng: 0 }, {})
