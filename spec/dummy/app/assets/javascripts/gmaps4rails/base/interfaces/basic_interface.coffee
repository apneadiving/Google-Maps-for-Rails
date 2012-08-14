Gmaps4Rails.Interfaces ||= {}

Gmaps4Rails.Interfaces.Basic =

  clear: ()->
    throw "clear should be implemented in polyline"

  show: () ->
    throw "show should be implemented in polyline"

  hide: () ->
    throw "hide should be implemented in polyline"