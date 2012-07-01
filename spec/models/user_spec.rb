require 'spec_helper'

include Geocoding

set_gmaps4rails_options!

describe Gmaps4rails::ActsAsGmappable do

  let(:user)         { Factory(:user) }
  let(:invalid_user) { FactoryGirl.build(:invalid_user) }
  
  before(:each) do
    Geocoding.stub_geocoding
  end
  
  context "standard configuration, valid user" do
    
    it "should have a geocoded position" do
      user.should have_same_position_as TOULON
    end
  
    it "should set boolean to true once user is created" do
      user.gmaps.should be_true
    end
    
    context "process_geocoding" do
      context "Proc" do
        it "should prevent geocoding when returns false" do
          user.instance_eval do
            def gmaps4rails_options
              DEFAULT_CONFIG_HASH.merge({ :process_geocoding => lambda {|user| false } })
            end
          end
          Gmaps4rails.should_not_receive(:geocode)
          user.update_attributes(:address => "Strasbourg, france")
        end
        
        context "geocoding required" do
          it "should trigger the geocoding" do
            user.instance_eval do
              def gmaps4rails_options
                DEFAULT_CONFIG_HASH.merge({ :process_geocoding => lambda {|user| true } })
              end
            end
            Gmaps4rails.should_receive(:geocode)
            user.update_attributes(:address => "Strasbourg, france")
          end
          
          it "should update coordinates but not update checker" do
            #first default behavior
            user.update_attributes(:gmaps => false, :address => "Strasbourg, france")
            user.gmaps.should eq true
            #then tested behavior
            user.instance_eval do
              def gmaps4rails_options
                DEFAULT_CONFIG_HASH.merge({ :process_geocoding => lambda {|user| true } })
              end
            end
            user.update_attributes(:gmaps => false, :address => "Strasbourg, france")
            user.gmaps.should eq false
          end
        end
      end
    end

    
    it "should not geocode again after address changes if checker is true" do
      user.update_attributes({ :address => "Paris, France" })
      user.should have_same_position_as TOULON
    end
    
    it "should geocode after address changes if checker is false" do
      user.update_attributes({ :address => "Paris, France", 
                               :gmaps        => false})
      user.should have_same_position_as PARIS
    end
  end
  
  context "standard configuration, invalid address" do
    
    it "should raise an error if validation option is turned on and address incorrect" do
      invalid_user.should_not be_valid, "Address invalid"
    end
    
    it "should not set boolean to true when address update fails" do
      invalid_user.gmaps.should_not be_true
    end
  end
    

  context "acts_as_gmappable options" do
   
    after(:all) do 
      #reset all configuration to default
      set_gmaps4rails_options!
    end
    
    it "should call google api with http by default" do
      address = "toulon, france"
      Gmaps4rails.should_receive(:geocode).with(address, "en", false, "http").and_return [TOULON]
      User.create(:address => address)
    end
    
    it "should call google api with https if passed in settings" do
      set_gmaps4rails_options!({ :protocol => "https" })
      address = "toulon, france"
      Gmaps4rails.should_receive(:geocode).with(address, "en", false, "https").and_return [TOULON]
      User.create(:address => address)
      set_gmaps4rails_options!({ :protocol => "http" })
    end
    
    it "should use indifferently a db column for address if passed in config" do
      set_gmaps4rails_options!({:address => "sec_address"})
      user = Factory(:user, :sec_address => "Toulon, France")
      user.should have_same_position_as TOULON
    end

    it "should save the normalized address if requested" do
      set_gmaps4rails_options!({ :normalized_address => "norm_address" })
      user.norm_address.should == "Toulon, France"
    end

    it "should override user's address with normalized address if requested" do
      set_gmaps4rails_options!({ :normalized_address => "sec_address" })
      user = Factory(:user, :sec_address => "ToUlOn, FrAnCe")
      user.sec_address.should == "Toulon, France"
    end

    it "should display the proper error message when address is invalid" do
      set_gmaps4rails_options!({ :msg => "Custom Address invalid"})
      invalid_user.should_not be_valid
      invalid_user.errors[:address].should include("Custom Address invalid")
    end

    it "should not raise an error if validation option is turned off" do
      set_gmaps4rails_options!({ :validation => false })
      invalid_user.should be_valid
    end

    it "should save longitude and latitude to the customized columns" do
      set_gmaps4rails_options!({
                              :lat_column     => "lat_test",
                              :lng_column     => "long_test"
                              })
      user.latitude.should be_nil
      user.should have_same_position_as TOULON
    end

    it "should not save the boolean if check_process is false" do
      set_gmaps4rails_options!({ :check_process  => false })
      user.gmaps.should be_nil
    end

    it "should geocode after each save if 'check_process' is false" do
      set_gmaps4rails_options!({ :check_process  => false })
      user = Factory(:user, :address => "Paris, France")
      user.should have_same_position_as PARIS
    end

    it "should save to the proper boolean checker set in checker" do
      set_gmaps4rails_options!({ :checker => "bool_test" })
      user.gmaps.should be_nil
      user.bool_test.should be_true
    end     
    
    it "should call a callback in the model if asked to" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :callback   => "save_callback" })
        end

        def save_callback(data)
          self.called_back = true
        end

        attr_accessor :called_back
      end
      user.called_back.should be_true
    end
    
  end

 

end