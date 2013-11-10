class @Gmaps.Google.Builders.Marker extends Gmaps.Objects.BaseBuilder

  @CURRENT_INFOWINDOW: undefined
  @CACHE_STORE: {}

  # args:
  #   lat
  #   lng
  #   infowindow
  #   marker_title
  #   picture
  #     anchor: [x,y]
  #     url
  #     width
  #     height
  #   shadow
  #     anchor: [x,y]
  #     url
  #     width
  #     height
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#MarkerOptions
  # internal_options
  #   singleInfowindow: true/false
  #   maxRandomDistance: null / int in meters
  constructor: (@args, @provider_options = {}, @internal_options = {})->
    @before_init()
    @create_marker()
    @create_infowindow()
    @after_init()

  build: ->
    new(@model_class())(@serviceObject, @infowindow)

  create_marker: ->
    @serviceObject = new(@primitives().marker)(@marker_options())

  create_infowindow: ->
    return null unless _.isString @args.infowindow
    @infowindow = new(@primitives().infowindow)({content: @args.infowindow })
    @bind_infowindow()

  marker_options: ->
    coords = @_randomized_coordinates()
    base_options =
      title:    @args.marker_title
      position: new(@primitives().latLng)(coords[0], coords[1])
      icon:     @_get_picture('picture')
      shadow:   @_get_picture('shadow')
    _.extend @provider_options, base_options

  bind_infowindow: ->
    @addListener 'click', @infowindow_binding

  infowindow_binding: =>
    @panTo()
    @constructor.CURRENT_INFOWINDOW.close() if @_should_close_infowindow()
    @infowindow.open( @getServiceObject().getMap(), @getServiceObject())
    @constructor.CURRENT_INFOWINDOW = @infowindow

  panTo: ->
    @getServiceObject().getMap().panTo @getServiceObject().getPosition()

  _get_picture: (picture_name)->
    return null if !_.isObject(@args[picture_name]) || !_.isString(@args[picture_name].url)
    @_create_or_retrieve_image @_picture_args(picture_name)

  _create_or_retrieve_image: (picture_args) ->
    if @constructor.CACHE_STORE[picture_args.url] is undefined
      @constructor.CACHE_STORE[picture_args.url] = new(@primitives().markerImage)(picture_args.url, picture_args.size, picture_args.origin, picture_args.anchor , picture_args.scaledSize)

    @constructor.CACHE_STORE[picture_args.url]

  _picture_args: (picture_name)->
    size =  new(@primitives().size)(@args[picture_name].width, @args[picture_name].height)
    if @args[picture_name].scale_width && @args[picture_name].scale_height
      scaledSize = new(@primitives().size)(@args[picture_name].scale_width, @args[picture_name].scale_height)
    else
      scaledSize = size
      
    {
      url:        @args[picture_name].url
      anchor:     @_createImageAnchorPosition @args[picture_name].anchor
      size:       size
      scaledSize: scaledSize
      origin:     null
    }

  _createImageAnchorPosition : (anchorLocation) ->
    return null unless _.isArray anchorLocation
    new(@primitives().point)(anchorLocation[0], anchorLocation[1])

  _should_close_infowindow: ->
    @internal_options.singleInfowindow and @constructor.CURRENT_INFOWINDOW?

  _randomized_coordinates: ->
    return [@args.lat, @args.lng] unless _.isNumber(@internal_options.maxRandomDistance)

    #gives a value between -1 and 1
    random = -> (Math.random() * 2 - 1)
    dx  = @internal_options.maxRandomDistance * random()
    dy  = @internal_options.maxRandomDistance * random()
    Lat = parseFloat(@args.lat) + (180/Math.PI)*(dy/6378137)
    Lng = parseFloat(@args.lng) + ( 90/Math.PI)*(dx/6378137)/Math.cos(@args.lat)
    return [Lat, Lng]

