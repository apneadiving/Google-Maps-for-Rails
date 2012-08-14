Gmaps4Rails.Interfaces ||= {}

Gmaps4Rails.Interfaces.Marker =

  createInfoWindow : () ->
    throw "createInfoWindow should be implemented in marker"

  clear: ()->
    throw "clear should be implemented in marker"

  show: () ->
    throw "show should be implemented in marker"

  hide: () ->
    throw "hide should be implemented in marker"