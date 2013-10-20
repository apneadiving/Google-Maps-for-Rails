# This is a manifest file that'll be compiled into application.js, which will include all the files
# listed below.
#
# Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
# or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
#
# It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
# the compiled file.
#
# WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
# GO AFTER THE REQUIRES BELOW.
#
# require jquery
# require jquery_ujs
#
# require 'gmaps4rails/base'
# require 'gmaps4rails/google'
# require 'gmaps4rails/bing'
#= require 'underscore'
#= require 'gmaps/base'
#= require 'gmaps/google'

Overrides = {}

# class Overrides.Marker extends Gmaps.Google.Objects.Marker

#   create_marker: ->
#     options = _.extend @marker_options(), @rich_marker_options()
#     new RichMarker options

#   rich_marker_options: ->
#     _.extend(@marker_options(), { content: 'rich marker' })

@handler = null

infobox = (boxText)->
    content: boxText
    pixelOffset: new google.maps.Size(-140, 0)
    boxStyle:
      width: "280px"

class Overrides.Marker extends Gmaps.Google.Objects.Marker

  create_infowindow : () ->
    return null unless _.isString @args.description

    boxText = document.createElement("div")
    boxText.setAttribute("class", 'yellow') #to customize
    boxText.innerHTML = @args.description
    infowindow = new InfoBox(infobox(boxText))

    @bind_infowindow infowindow
    infowindow

@build = ->
  window.handler = Gmaps.build 'Google', { models: { Marker: Overrides.Marker} }
  window.handler.buildMap { provider: {}, internal: {id: 'map'}}, ->
    window.handler.addMarker({ lat: 0, lng: 0, description: 'coucou' }, {})

