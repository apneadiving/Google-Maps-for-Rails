@Gmaps = 
  triggerOldOnload: ->
    window.Gmaps.oldOnload() if typeof(window.Gmaps.oldOnload) == 'function'

  loadMaps: ->
    #loop through all variable names.
    #there should only be maps inside so it trigger their load function
    for key, value of window.Gmaps
      searchLoadIncluded = key.search(/^load_/)
      #console.log key, searchLoadIncluded
      if searchLoadIncluded != -1
        #load_function_name = "load_" + key
        window.Gmaps[key]()

