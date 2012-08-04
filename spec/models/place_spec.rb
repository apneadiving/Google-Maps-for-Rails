require 'spec_helper'

include Geocoding

set_gmaps4rails_options!

require 'mongoid'

Mongoid.configure do |config|
  Mongoid::VersionSetup.configure config
end

RSpec.configure do |config|
  # config.mock_with(:mocha)

  config.before(:each) do
    Mongoid.purge!
    # Mongoid.database.collections.each do |collection|
    #   unless collection.name =~ /^system\./
    #     collection.remove
    #   end
    # end
  end
end


describe Gmaps4rails::ActsAsGmappable do

  let(:place)         { Factory(:place) }
  let(:invalid_place) { Factory.build(:invalid_place) }
  
  before(:each) do
    Geocoding.stub_geocoding
  end
  
  context "standard configuration, valid place" do
    it "should save longitude and latitude to the customized array" do
      set_gmaps4rails_options!(:lat_lng_array  => 'location')
      place.location.should_not be_nil
      place.should have_same_position_as TOULON
    end
  end
end