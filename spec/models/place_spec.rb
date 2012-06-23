require 'spec_helper'

include Geocoding

set_gmaps4rails_options!

describe Gmaps4rails::ActsAsGmappable do

  let(:place)         { Factory(:place) }
  let(:invalid_place) { Factory.build(:invalid_place) }
  
  before(:each) do
    Geocoding.stub_geocoding
  end
  
  context "standard configuration, valid place" do
    it "should save longitude and latitude to the customized array" do
      set_gmaps4rails_options!(:lat_lng_array  => 'location')
      place.location.should be_nil
      place.should have_same_position_as TOULON
    end
  end
end