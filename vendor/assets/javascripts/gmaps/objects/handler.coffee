class @Gmaps.Objects.Handler

  # options:
  #   markers:
  #     maxRandomDistance: null / int in meters
  #     singleInfowindow:  true/false
  #     clusterer:         null or object with options if you want clusters
  #   models:   object, custom models   if you have some
  #   builders: object, custom builders if you have some
  #
  constructor: (@type, options = {})->
    @setPrimitives options
    @setOptions options
    @_cacheAllBuilders()
    @resetBounds()

  buildMap: (options, onMapLoad = ->)->
    @map = @_builder('Map').build options, =>
      @_createClusterer()
      onMapLoad()

  # return array of marker objects
  addMarkers: (markers_data, provider_options)->
    _.map markers_data, (marker_data)=>
      @addMarker marker_data, provider_options

  # return marker object
  addMarker: (marker_data, provider_options)->
    marker = @_builder('Marker').build(marker_data, provider_options, @marker_options)
    marker.setMap(@getMap())
    @clusterer.addMarker marker
    marker

  # return array of circle objects
  addCircles: (circles_data, provider_options)->
    _.map circles_data, (circle_data)=>
      @addCircle circle_data, provider_options

  # return circle object
  addCircle: (circle_data, provider_options)->
    @_addResource('circle', circle_data, provider_options)

  # return array of polyline objects
  addPolylines: (polylines_data, provider_options)->
    _.map polylines_data, (polyline_data)=>
      @addPolyline polyline_data, provider_options

  # return polyline object
  addPolyline: (polyline_data, provider_options)->
    @_addResource('polyline', polyline_data, provider_options)

  # return array of polygon objects
  addPolygons: (polygons_data, provider_options)->
    _.map polygons_data, (polygon_data)=>
      @addPolygon polygon_data, provider_options

  # return polygon object
  addPolygon: (polygon_data, provider_options)->
    @_addResource('polygon', polygon_data, provider_options)

  # return array of kml objects
  addKmls: (kmls_data, provider_options)->
    _.map kmls_data, (kml_data)=>
      @addKml kml_data, provider_options

  # return kml object
  addKml: (kml_data, provider_options)->
    @_addResource('kml', kml_data, provider_options)

  # removes markers from map
  removeMarkers: (gem_markers)->
    _.map gem_markers, (gem_marker)=>
      @removeMarker gem_marker

  # removes marker from map
  removeMarker: (gem_marker)->
    gem_marker.clear()
    @clusterer.removeMarker(gem_marker)

  fitMapToBounds: ->
    @map.fitToBounds @bounds.getServiceObject()

  getMap: ->
    @map.getServiceObject()

  setOptions: (options)->
    @marker_options = _.extend @_default_marker_options(), options.markers
    @builders       = _.extend @_default_builders(),       options.builders
    @models         = _.extend @_default_models(),         options.models

  resetBounds: ->
    @bounds = @_builder('Bound').build()

  setPrimitives: (options)->
    @primitives = if options.primitives is undefined
                    @_rootModule().Primitives()
                  else
                    if _.isFunction(options.primitives) then options.primitives() else options.primitives

  currentInfowindow: ->
    @builders.Marker.CURRENT_INFOWINDOW

  _addResource: (resource_name, resource_data, provider_options)->
    resource = @_builder(resource_name).build(resource_data, provider_options)
    resource.setMap(@getMap())
    resource

  _cacheAllBuilders: ->
    that = @
    _.each ['Bound', 'Circle',  'Clusterer', 'Kml', 'Map', 'Marker', 'Polygon', 'Polyline'], (kind)-> that._builder(kind)

  _clusterize: ->
    _.isObject @marker_options.clusterer

  _createClusterer: ->
    @clusterer = @_builder('Clusterer').build({ map: @getMap() }, @marker_options.clusterer )

  _default_marker_options: ->
    _.clone {
      singleInfowindow:  true
      maxRandomDistance: 0
      clusterer:
        maxZoom:  5
        gridSize: 50
    }

  _builder: (name)->
    name = @_capitalize(name)
    @["__builder#{name}"] ?= Gmaps.Objects.Builders(@builders[name], @models[name], @primitives)
    @["__builder#{name}"]

  _default_models: ->
    models = _.clone(@_rootModule().Objects)
    if @_clusterize()
      models
    else
      models.Clusterer = Gmaps.Objects.NullClusterer
      models

  _capitalize: (string)->
    string.charAt(0).toUpperCase() + string.slice(1)

  _default_builders: ->
    _.clone @_rootModule().Builders

  _rootModule: ->
    @__rootModule ?= Gmaps[@type]
    @__rootModule
