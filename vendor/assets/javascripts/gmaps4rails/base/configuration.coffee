@Gmaps4Rails.Configuration =

  setConf: ->
    if @CONF?
      @mergeObjects(@CONF, @DEFAULT_CONF)
    else
      @DEFAULT_CONF