@Gmaps = 
  triggerOldOnload: ->
    window.Gmaps.oldOnload() if typeof(window.Gmaps.oldOnload) == 'function'

  loadMaps: ->
    #loop through all variable names.
    #there should only be maps inside so it trigger their load function
    for key, value of window.Gmaps
      #console.log key, searchLoadIncluded
      if /^load_/.test(key)
        #load_function_name = "load_" + key
        window.Gmaps[key]()

