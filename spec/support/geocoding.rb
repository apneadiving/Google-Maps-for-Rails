module Geocoding
  
  DEFAULT_CONFIG_HASH = {
    :lat_column     => "latitude",
    :lng_column     => "longitude",
    :check_process  => true,
    :checker        => "gmaps",
    :msg            => "Address invalid",
    :validation     => true,
    :address        => "address",
    :language       => "en",
    :protocol       => "http",
    :process_geocoding => true
  }

  PARIS  = { :latitude => 48.856614, :longitude => 2.3522219 }
  TOULON = { :latitude => 43.124228, :longitude => 5.928 }

  #set model configuration
  def set_gmaps4rails_options!(change_conf = {})
    User.class_eval do
      define_method "gmaps4rails_options" do
        DEFAULT_CONFIG_HASH.merge(change_conf)
      end
    end
  end
  
  def self.stub_geocoding
    Gmaps4rails.stub(:geocode) do |*args|
      case args[0]
      when "Paris, France"
        [{:lat=>48.856614, :lng=>2.3522219, :matched_address=>"Paris, France", :bounds=>{"northeast"=>{"lat"=>48.902145, "lng"=>2.4699209}, "southwest"=>{"lat"=>48.815573, "lng"=>2.224199}}, :full_data=>{"address_components"=>[{"long_name"=>"Paris", "short_name"=>"Paris", "types"=>["locality", "political"]}, {"long_name"=>"Paris", "short_name"=>"75", "types"=>["administrative_area_level_2", "political"]}, {"long_name"=>"Ile-de-France", "short_name"=>"IdF", "types"=>["administrative_area_level_1", "political"]}, {"long_name"=>"France", "short_name"=>"FR", "types"=>["country", "political"]}], "formatted_address"=>"Paris, France", "geometry"=>{"bounds"=>{"northeast"=>{"lat"=>48.902145, "lng"=>2.4699209}, "southwest"=>{"lat"=>48.815573, "lng"=>2.224199}}, "location"=>{"lat"=>48.856614, "lng"=>2.3522219}, "location_type"=>"APPROXIMATE", "viewport"=>{"northeast"=>{"lat"=>48.9153104, "lng"=>2.4802813}, "southwest"=>{"lat"=>48.7978487, "lng"=>2.2241625}}}, "types"=>["locality", "political"]}}] 
      when "home"
        raise Gmaps4rails::GeocodeStatus
      else
        [{:lat=>43.124228, :lng=>5.928, :matched_address=>"Toulon, France", :bounds=>{"northeast"=>{"lat"=>43.171673, "lng"=>5.987382999999999}, "southwest"=>{"lat"=>43.101049, "lng"=>5.879479}}, :full_data=>{"address_components"=>[{"long_name"=>"Toulon", "short_name"=>"Toulon", "types"=>["locality", "political"]}, {"long_name"=>"Var", "short_name"=>"83", "types"=>["administrative_area_level_2", "political"]}, {"long_name"=>"Provence-Alpes-Cote d'Azur", "short_name"=>"PACA", "types"=>["administrative_area_level_1", "political"]}, {"long_name"=>"France", "short_name"=>"FR", "types"=>["country", "political"]}], "formatted_address"=>"Toulon, France", "geometry"=>{"bounds"=>{"northeast"=>{"lat"=>43.171673, "lng"=>5.987382999999999}, "southwest"=>{"lat"=>43.101049, "lng"=>5.879479}}, "location"=>{"lat"=>43.124228, "lng"=>5.928}, "location_type"=>"APPROXIMATE", "viewport"=>{"northeast"=>{"lat"=>43.156795, "lng"=>5.9920297}, "southwest"=>{"lat"=>43.0916437, "lng"=>5.8639703}}}, "types"=>["locality", "political"]}}]
      end
    end
  end
end