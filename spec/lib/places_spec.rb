require 'spec_helper'

describe "Places" do
  
  let(:places) { File.read "spec/fixtures/google_places_valid.json" }
  
  context "valid request" do
    before(:each) do
      stub_request(:get, "https://maps.googleapis.com/maps/api/place/search/json?key=key&language=en&location=0,0&radius=7500&sensor=false").
               to_return(:status => 200, :body => places, :headers => {})
    end
    
    it "does something" do
      results = Gmaps4rails.places(0, 0, "key")
      result  = OpenStruct.new results.first
      
      result.lat.should eq -33.871983
      result.lng.should eq 151.199086
      result.name.should eq "Zaaffran Restaurant - BBQ and GRILL, Darling Harbour"
      result.reference.should =~ /^CpQBjAAAAHDHuimUQATR6gfoWNm.*/
      result.vicinity.should eq "Harbourside Centre 10 Darling Drive, Darling Harbour, Sydney"
    end

  end
end