class @Gmaps.Objects.Handler


  # markers:
  #   maxRandomDistance: false / int in meters
  #   singleInfowindow:  true/false
  #   clusterer:         null or object with options if you want clusters
  # models:   custom models   if you have some
  # builders: custom builders if you have some
  constructor: (@type, options = {})->
    @primitives = Gmaps.Primitives( @_rootModule().Primitives() )
    @setOptions options
    @cache      = {}
    @bounds     = @_createBounds()

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

  fitMapToBounds: ->
    @map.fitToBounds @bounds.getServiceObject()

  getMap: =>
    @map.getServiceObject()

  setOptions: (options)->
    @marker_options = _.extend @_default_marker_options(), options.markers
    @builders       = _.extend @_default_builders(),       options.builders
    @models         = _.extend @_default_models(),         options.models

  _clusterize: ->
    _.isObject @marker_options.clusterer

  _createClusterer: =>
    @clusterer = @_clusterer_builder().build({ map: @getMap() }, @marker_options.clusterer )

  _createBounds: ->
    @bounds = @_bound_builder().build()

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
    @_builder('Marker')

  _map_builder: ->
    @_builder('Map')

  _circle_builder: ->
    @_builder('Circle')

  _builder: (name)->
    @["__builder#{name}"] ?= @builders[name](@models[name], @primitives, @cache)
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
