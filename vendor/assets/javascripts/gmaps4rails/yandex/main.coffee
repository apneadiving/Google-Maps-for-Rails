#= require './shared'

#= require_tree './objects'

class @Gmaps4RailsYandex extends Gmaps4Rails.BaseController

  @include Gmaps4Rails.Yandex.Shared
  
  constructor: ->
    super


  getModule: ->
    Gmaps4Rails.Yandex

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////
  
  createClusterer: (marker_serviceObject_array)->

  clearClusterer: ->

  findUserLocation : (controller, center_on_user) ->
    controller.userLocation = [ymaps.geolocation.latitude, ymaps.geolocation.longitude]
    if center_on_user
      controller.map.centerMapOnUser(controller.userLocation)

  #////////////////////////////////////////////////////
  #/////////////// Private methods ////////////////////
  #////////////////////////////////////////////////////
