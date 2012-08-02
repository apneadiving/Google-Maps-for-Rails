
moduleKeywords = ['extended', 'included']

@Gmaps4Rails = {}

class @Gmaps4Rails.Common

  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      # Assign properties to the prototype
      @::[key] = value

    #console.log obj, this
    obj.included?.apply(@)
    this

  # cloneObject: (obj) ->
  #   copy = {}
  #   copy[attr] = obj[attr] for attr in obj
  #   copy

  #//basic function to check existence of a variable
  exists : (var_name) ->
    return (var_name  != "" and typeof var_name != "undefined")

  mergeObjects: (object, defaultObject) ->
    @constructor.mergeObjects(object, defaultObject)

  @mergeObjects: (object, defaultObject) ->
    copy_object = {}
    for key, value of object
      copy_object[key] = value

    for key, value of defaultObject
        copy_object[key] = value unless copy_object[key]?
    return copy_object

  # mergeWithDefault : (objectName) ->
  #   default_object = @["default_" + objectName]
  #   object = @[objectName]
  #   @[objectName] = @mergeObjects(object, default_object)
  #   return true

  @mergeWith : (object) ->
    for key, value of object
        @[key] = value unless @[key]?

  #gives a value between -1 and 1
  random : -> return(Math.random() * 2 -1)

#window.Gmaps4Rails = Gmaps4Rails
