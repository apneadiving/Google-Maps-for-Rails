class @Gmaps.Google.Objects.Marker extends Gmaps.Base

  @include Gmaps.Google.Objects.Common

  @CURRENT_INFOWINDOW: null
  CACHE_STORE: []

   # args:
  #   lat
  #   lng
  #   infowindow
  #   marker_title
  #   marker
  #     anchor: [x,y]
  #     picture
  #     width
  #     height
  #   shadow
  #     anchor: [x,y]
  #     picture
  #     width
  #     height
  # provider options:
  #   https://developers.google.com/maps/documentation/javascript/reference?hl=fr#MarkerOptions
  # internal_options
  #   singleInfowindow: true/false
  #   maxRandomDistance: null / int in meters
  constructor: (@args, @provider_options, @internal_options = {})->
    @serviceObject = @create_marker()
    @infowindow    = @create_infowindow()
    @after_create()

  addInfowindowListener: (action, fn)=>
    @PRIMITIVES.addListener @infowindow, action, fn

  create_marker: ->
    new @PRIMITIVES.marker @marker_options()

  create_infowindow: ->
    return null unless _.isString @args.infowindow
    infowindow = new @PRIMITIVES.infowindow({content: @args.infowindow })
    @bind_infowindow infowindow
    infowindow

  marker_options: ->
    coords = @_randomized_coordinates()
    base_options =
      title:    @args.marker_title
      position: new @PRIMITIVES.latLng(coords[0], coords[1])
      icon:     @_get_picture('picture')
      shadow:   @_get_picture('shadow')
    _.extend base_options, @provider_options

  bind_infowindow: (infowindow)->
    @addListener 'click', =>
      @constructor.CURRENT_INFOWINDOW.close() if @_should_close_infowindow()
      infowindow.open( @getServiceObject().getMap(), @getServiceObject())
      @constructor.CURRENT_INFOWINDOW = infowindow

  updateBounds: (bounds)->
    bounds.extend(@getServiceObject().position)

  _get_picture: (picture_name)->
    @_create_or_retrieve_image @_picture_args(picture_name)

  _create_or_retrieve_image: (picture_args) ->
    return null unless _.isString(picture_args.url)

    existing_image = _.find @CACHE_STORE.markerImages, (el)->
      el.url is picture_args.url

    if existing_image is undefined
      new @PRIMITIVES.markerImage picture_args.url, picture_args.size, picture_args.origin, picture_args.anchor , picture_args.scaledSize
    else
      existing_image

  _picture_args: (picture_name)->
    return {} unless _.isObject @args[picture_name]
    {
      url:        @args[picture_name].url
      anchor:     @_createImageAnchorPosition @args[picture_name].anchor
      size:       new @PRIMITIVES.size @args[picture_name].width, @args[picture_name].height
      scaledSize: null
      origin:     null
    }

  _createImageAnchorPosition : (anchorLocation) ->
    return null unless _.isArray anchorLocation
    new @PRIMITIVES.point(anchorLocation[0], anchorLocation[1])

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

