
moduleKeywords = ['extended', 'included']

class @Gmaps.Common

  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      # Assign properties to the prototype
      @::[key] = value
    obj.included?.apply(@)
    this

  #gives a value between -1 and 1
  random : -> return(Math.random() * 2 -1)
