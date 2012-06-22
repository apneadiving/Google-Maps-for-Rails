require 'spec_helper'

describe "Geocode" do
  
  context "data extraction from google's json" do
    
    let(:result)    { Gmaps4rails.geocode("stubbed").first }
    let(:geocoding) { File.read "spec/fixtures/google_geocoding_toulon_france.json" }
    
    before(:each) do
      stub_request(:get, "http://maps.googleapis.com/maps/api/geocode/json?address=stubbed&language=en&sensor=false").
        to_return(:status => 200, :body => geocoding, :headers => {})
    end

    it "should extract lat and lng" do
      result[:lat].should eq 43.1242280
      result[:lng].should eq 5.9280
    end
    
    it "should extract matched address" do
      result[:matched_address].should eq "Toulon, France"
    end
    
  end
  
  context "expected errors" do
    
    it "should raise an error when geocoding has no answer" do
      wrong_geocoding = File.read "spec/fixtures/google_wrong_geocoding.json"
      stub_request(:get, "http://maps.googleapis.com/maps/api/geocode/json?address=stubbed&language=en&sensor=false").
        to_return(:status => 200, :body => wrong_geocoding, :headers => {})
        
      lambda { Gmaps4rails.geocode("stubbed")}.should raise_error Gmaps4rails::GeocodeStatus
    end
    
    it "should raise an error when google server fails" do
      stub_request(:get, "http://maps.googleapis.com/maps/api/geocode/json?address=stubbed&language=en&sensor=false").
        to_return(:status => 404, :body => "", :headers => {})
      
      lambda { Gmaps4rails.geocode("stubbed")}.should raise_error Gmaps4rails::GeocodeNetStatus
    end
    
  end  
  
end

