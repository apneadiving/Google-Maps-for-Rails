class @Gmaps.Objects.Handler


  # markers:
  #   store: true/false
  #   maxRandomDistance: false / int in meters
  #   singleInfowindow:  true/false
  #   clusterer:         null or object with options if you want clusters
  # models:   custom models   if you have some
  # builders: custom builders if you have some
  constructor: (@type, options = {})->
    @primitives     = Gmaps.Primitives( @_rootModule().Primitives() )
    @marker_options = _.extend @_default_marker_options(), options.markers
    @builders       = _.extend @_default_builders(),       options.builders
    @models         = _.extend @_default_models(),         options.models
    @cache          = {}
    @markers        = []

  buildMap: (options, onMapLoad = ->)=>
    @_map = @_map_builder().build(options, onMapLoad)
    @createClusterer()

  addMarkers: (markers_data, provider_options)=>
    _.each markers_data, (marker_data)=>
      @addMarker marker_data, provider_options

  addMarker: (marker_data, provider_options)=>
    marker = @_marker_builder().build(marker_data, provider_options, @marker_options)
    marker.associate_to_map(@getMap())
    @clusterer.addMarker marker
    @markers.push marker if @marker_options.store
    marker

  getMap: =>
    @_map.serviceObject

  createClusterer: =>
    @clusterer = @_clusterer_builder().build({ map: @getMap() }, @marker_options.clusterer )

  clearClusterer: =>
    @clusterer.clear()

  _clusterize: ->
    _.isObject @marker_options.clusterer

  _default_marker_options: ->
    {
      store: true
      singleInfowindow:  true
      maxRandomDistance: 100
      clusterer:
        maxZoom:  5
        gridSize: 50
    }

  _clusterer_builder: ->
    @__clusterer_builder ?= @builders.Clusterer(@models.Clusterer, @primitives)
    @__clusterer_builder

  _marker_builder: ->
    @__marker_builder ?= @builders.Marker(@models.Marker, @primitives, @cache)
    @__marker_builder

  _map_builder: ->
    @__map_builder ?= @builders.Map(@models.Map, @primitives)
    @__map_builder

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
