class @Gmaps.Objects.Handler

  # options:
  #   markers:
  #     maxRandomDistance: null / int in meters
  #     singleInfowindow:  true/false
  #     clusterer:         null or object with options if you want clusters
  #   models:   custom models   if you have some
  #   builders: custom builders if you have some
  constructor: (@type, options = {})->
    @primitives = Gmaps.Primitives( @_rootModule().Primitives() )
    @setOptions options
    @resetBounds()

  buildMap: (options, onMapLoad = ->)=>
    @map = @_map_builder().build(options, onMapLoad)
    @_createClusterer()

  addMarkers: (markers_data, provider_options)=>
    _.map markers_data, (marker_data)=>
      @addMarker marker_data, provider_options

  addMarker: (marker_data, provider_options)=>
    marker = @_marker_builder().build(marker_data, provider_options, @marker_options)
    marker.associate_to_map(@getMap())
    @clusterer.addMarker marker
    marker

  addCircles: (circles_data, provider_options)=>
    _.map circles_data, (circle_data)=>
      @addCircle circle_data, provider_options

  addCircle: (circle_data, provider_options)=>
    circle = @_circle_builder().build(circle_data, provider_options)
    circle.associate_to_map(@getMap())
    circle

  addPolylines: (polylines_data, provider_options)=>
    _.map polylines_data, (polyline_data)=>
      @addPolyline polyline_data, provider_options

  addPolyline: (polyline_data, provider_options)=>
    polyline = @_polyline_builder().build(polyline_data, provider_options)
    polyline.associate_to_map(@getMap())
    polyline

  addPolygons: (polygons_data, provider_options)=>
    _.map polygons_data, (polygon_data)=>
      @addPolygon polygon_data, provider_options

  addPolygon: (polygon_data, provider_options)=>
    polygon = @_polygon_builder().build(polygon_data, provider_options)
    polygon.associate_to_map(@getMap())
    polygon

  addKmls: (kmls_data, provider_options)=>
    _.map kmls_data, (kml_data)=>
      @addKml kml_data, provider_options

  addKml: (kml_data, provider_options)=>
    kml = @_kml_builder().build(kml_data, provider_options)
    kml.associate_to_map(@getMap())
    kml

  fitMapToBounds: ->
    @map.fitToBounds @bounds.getServiceObject()

  getMap: =>
    @map.getServiceObject()

  setOptions: (options)->
    @marker_options = _.extend @_default_marker_options(), options.markers
    @builders       = _.extend @_default_builders(),       options.builders
    @models         = _.extend @_default_models(),         options.models

  resetBounds: ->
    @bounds = @_bound_builder().build()

  _clusterize: ->
    _.isObject @marker_options.clusterer

  _createClusterer: =>
    @clusterer = @_clusterer_builder().build({ map: @getMap() }, @marker_options.clusterer )

  _default_marker_options: ->
    {
      singleInfowindow:  true
      maxRandomDistance: 100
      clusterer:
        maxZoom:  5
        gridSize: 50
    }

  _bound_builder: ->
    @_builder('Bound')

  _clusterer_builder: ->
    @_builder('Clusterer')

  _marker_builder: ->
    @__builderMarker ?= @builders.Marker(@models.Marker, @primitives, @marker_options)
    @__builderMarker

  _map_builder: ->
    @_builder('Map')

  _kml_builder: ->
    @_builder('Kml')

  _circle_builder: ->
    @_builder('Circle')

  _polyline_builder: ->
    @_builder('Polyline')

  _polygon_builder: ->
    @_builder('Polygon')

  _builder: (name)->
    @["__builder#{name}"] ?= @builders[name](@models[name], @primitives)
    @["__builder#{name}"]

  _default_models: ->
    models = @_rootModule().Objects
    if @_clusterize()
      models
    else
      models.Clusterer = Gmaps.Objects.NullClusterer
      models

  _default_builders: ->
    @_rootModule().Builders

  _rootModule: ->
    @__rootModule ?= Gmaps[@type]
    @__rootModule
