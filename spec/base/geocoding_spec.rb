require 'spec_helper'

describe "Geocode" do
  
  it "should raise an error when address invalid" do
    lambda { Gmaps4rails.geocode("home")}.should raise_error Gmaps4rails::GeocodeStatus
  end
  
  it "should return results in the specified language" do
    result = Gmaps4rails.geocode("Toulon, France", "de")
    result.first[:matched_address].should eq "Toulon, Frankreich"
  end
  
  it "should raise an error when net connection failed" #TODO: Damn, I don't know how to test that!
  
end

