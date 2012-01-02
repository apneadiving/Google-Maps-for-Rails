module Gmaps4rails

  class GeocodeStatus         < StandardError; end
  class GeocodeNetStatus      < StandardError; end
  class GeocodeInvalidQuery   < StandardError; end
  class DirectionStatus       < StandardError; end
  class DirectionNetStatus    < StandardError; end
  class DirectionInvalidQuery < StandardError; end

end