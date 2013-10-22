#= require_self
#= require_tree './base'
#= require_tree './objects'

@Gmaps =

  build: (type, options = {})->
    model = if _.isFunction(options.handler) then options.handler else Gmaps.Objects.Handler
    new model(type, options)

  Builders: {}
  Objects:  {}

  Google:
    Objects:  {}
    Builders: {}
