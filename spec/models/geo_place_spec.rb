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

    # Tests Array position format in the form: [lng, lat]
    # F.ex required for integration with *geocoder* gem
    let(:geo_place)         { Factory(:geo_place) }
    let(:invalid_geo_place) { Factory.build(:invalid_geo_place) }
    
    before(:each) do
      Geocoding.stub_geocoding
    end
    
    context "standard configuration, valid place" do
      it "should save longitude and latitude to the customized position array" do
        set_gmaps4rails_options!(:position  => 'location', :pos_order => [:lng, :lat])
        geo_place.pos.should_not be_nil
        geo_place.should have_same_position_as TOULON
      end
    end
  end

end