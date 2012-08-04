@Gmaps4Rails.Marker = { } 

@Gmaps4Rails.Marker.Class =

  DEFAULT_CONF:
    #Marker config
    title: null
    #MarkerImage config
    picture : null
    width: 22
    length: 32
    draggable: false
    #clustering config
    do_clustering: false     # do clustering if set to true
    randomize: false         # Google maps can't display two markers which have the same coordinates. This randomizer enables to prevent this situation from happening.
    max_random_distance: 100 # in meters. Each marker coordinate could be altered by this distance in a random direction
    list_container: null     # id of the ul that will host links to all markers
    offset: 0                # used when adding_markers to an existing map. Because new markers are concated with previous one, offset is here to prevent the existing from being re-created.
    raw: {}                  # raw json to pass additional options

@Gmaps4Rails.Marker.Instance =

  getMap: ->
    @controller.getMapObject()