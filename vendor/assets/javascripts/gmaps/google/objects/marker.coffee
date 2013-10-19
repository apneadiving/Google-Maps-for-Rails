class @Gmaps.Google.Objects.Marker

  @CURRENT_INFOWINDOW: null

  # options:
  #   provider:
  #     { all desired options concerning markers from google api }
  # args:
  #   lat
  #   lng
  #   description
  #   rich_marker: html to put in rich marker
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
  constructor: (@args, @provider_options, @internal_options = {})->
    @serviceObject =  if @_is_basic_marker()
                        @_create_basic_marker()
                      else
                        if @_is_rich_marker()
                          @_create_rich_marker()
                        else
                          @_create_marker_with_picture()
    @infowindow = @create_infowindow()

    @after_create()

  addListener: (action, fn)=>
    @PRIMITIVES.addListener @serviceObject, action, fn

  addInfowindowListener: (action, fn)=>
    @PRIMITIVES.addListener @infowindow, action, fn

  associate_to_map: (map)=>
    @serviceObject.setMap map

  add_to_clusterer: (clusterer)=>

  after_create: ->

  create_infowindow: ->
    return unless _.isString @args.description
    infowindow = new @PRIMITIVES.infowindow({content: @args.description })
    @addListener 'click', =>
      @constructor.CURRENT_INFOWINDOW.close() if @_should_close_infowindow()
      infowindow.open( @serviceObject.getMap(), @serviceObject)
      @constructor.CURRENT_INFOWINDOW = infowindow
    infowindow

  _create_basic_marker: ->
    options = _.extend @basic_marker_options(), @provider_options
    new @PRIMITIVES.marker options

  _create_rich_marker: ->
    options = _.extend @rich_marker_options(), @provider_options
    new RichMarker options

  _create_marker_with_picture: ->
    options = _.extend @_marker_options(), @provider_options
    new @PRIMITIVES.marker options

  basic_marker_options: ->
    coords = @_randomized_coordinates()
    { position: @PRIMITIVES.latLng(coords[0], coords[1]) }

  rich_marker_options: ->
    _.extend(@basic_marker_options(), { content: @args.rich_marker })

  _marker_options: ->
    _.extend @basic_marker_options(), {
      icon:   @_marker_picture()
      shadow: @_shadow_picture()
    }

  _create_or_retrieve_image: (picture_args) ->
    return null unless _.isString(picture_args.url)

    existing_image = _.find @CACHE_STORE.markerImages, (el)->
      el.url is picture_args.url

    if existing_image is undefined
      image = new @PRIMITIVES.markerImage picture_args
      image
    else
      existing_image

  _marker_picture: ->
    @_create_or_retrieve_image @_marker_picture_args()

  _shadow_picture: ->
    @_create_or_retrieve_image @_shadow_picture_args()


  _marker_picture_args: ->
    return {} unless _.isObject @args.marker
    @_picture_args(@args.marker)

  _shadow_picture_args: ->
    return {} unless _.isObject @args.shadow
    @_picture_args(@args.shadow)

  _picture_args: (picture_params)->
    {
      url:     picture_params.picture
      anchor:  @_createImageAnchorPosition picture_params.anchor
      width:   picture_params.width
      height:  picture_params.height
    }

  _createImageAnchorPosition : (anchorLocation) ->
    return null unless _.isArray anchorLocation
    @PRIMITIVES.point(anchorLocation[0], anchorLocation[1])

  _should_close_infowindow: ->
    @internal_options.singleInfowindow and @constructor.CURRENT_INFOWINDOW?

  _is_basic_marker: ()->
    !@args.marker_picture? and !@_is_rich_marker()

  _is_rich_marker: ->
    @args.rich_marker?

  _randomized_coordinates: ->
    return [@args.lat, @args.lng] unless _.isNumber(@internal_options.maxRandomDistance)

    #gives a value between -1 and 1
    random = -> return(Math.random() * 2 -1)
    dx  = @internal_options.maxRandomDistance * random()
    dy  = @internal_options.maxRandomDistance * random()
    Lat = parseFloat(@args.lat) + (180/Math.PI)*(dy/6378137)
    Lng = parseFloat(@args.lng) + ( 90/Math.PI)*(dx/6378137)/Math.cos(@args.lat)
    return [Lat, Lng]

