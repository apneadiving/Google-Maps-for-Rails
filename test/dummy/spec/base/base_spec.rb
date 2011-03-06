require 'spec_helper'

describe "Basic Functions" do
  #Gmaps4rails.geocode(address)
  it "should geocode properly an address" do
    Gmaps4rails.geocode("alaska").should == [{:lat=>63.588753, :lng=>-154.4930619, :matched_address=>"Alaska, USA"}]
  end
  
  it "should raise an error when error invalid" do
    lambda { Gmaps4rails.geocode("home")}.should raise_error Gmaps4rails::GeocodeStatus
  end
  
  it "should raise an error when net connection failed" #TODO: Damn, I don't know how to test that!
  
end