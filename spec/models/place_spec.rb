if RUBY_VERSION == "1.9.3"

  require 'spec_helper'

  include Geocoding

  set_gmaps4rails_options!

  # Mongoid 3.x only
  require 'mongoid'
  require 'moped'

  Mongoid.configure do |config|
    config.connect_to('mongoid_geo_test')
  end

  describe Gmaps4rails::ActsAsGmappable do

    let(:place)         { Factory(:place) }
    let(:invalid_place) { Factory.build(:invalid_place) }
    
    before(:each) do
      Geocoding.stub_geocoding
    end
    
    context "standard configuration, valid place" do
      it "should save longitude and latitude to the customized position array" do
        set_gmaps4rails_options!(:position  => 'location')
        place.pos.should_not be_nil
        place.should have_same_position_as TOULON
      end
    end
  end

end