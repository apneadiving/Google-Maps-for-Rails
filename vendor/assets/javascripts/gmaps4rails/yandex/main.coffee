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

  #overwriting method from base controller since it doesn't fit here
  #clearMarkers: ->

  #////////////////////////////////////////////////////
  #/////////////// Private methods ////////////////////
  #////////////////////////////////////////////////////
