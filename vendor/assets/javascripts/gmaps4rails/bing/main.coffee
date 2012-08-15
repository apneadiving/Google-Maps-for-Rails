#= require './shared'

#= require_tree './objects'

class @Gmaps4RailsBing extends Gmaps4Rails.BaseController

  @include Gmaps4Rails.Bing.Shared
  
  constructor: ->
    super


  getModule: ->
    Gmaps4Rails.Bing

  #////////////////////////////////////////////////////
  #/////////////////// Clusterer //////////////////////
  #////////////////////////////////////////////////////
  
  createClusterer: (marker_serviceObject_array)->

  clearClusterer: ->

  #overwriting method from base controller since it doesn't fit here
  clearMarkers: ->

  #////////////////////////////////////////////////////
  #/////////////// Private methods ////////////////////
  #////////////////////////////////////////////////////
