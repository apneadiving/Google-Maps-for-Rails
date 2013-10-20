#= require_self
#= require_tree './base'
#= require_tree './objects'

# Gmaps.map = Gmaps.Builders.Map.build(type, options, callbacks)

# Gmaps.map.addMarkers(markers, options, callbacks)

# for each marker
#   Gmaps.Builders.Marker.build(type, options, callbacks)

@Gmaps =

  build: (type, options = {})->
    model = if _.isObject(options.handler) then options.handler else Gmaps.Objects.Handler
    new model(type, options)

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
