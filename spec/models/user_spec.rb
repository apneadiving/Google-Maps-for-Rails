require 'spec_helper'

include Geocoding

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

set_gmaps4rails_options!

describe Gmaps4rails::ActsAsGmappable do

  let(:user)         { Factory(:user) }
  let(:invalid_user) { Factory.build(:invalid_user) }
  
  before(:each) do
    Geocoding.stub_gecoding
  end
  
  context "standard configuration, valid user" do
    
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
    
    it "should have a geocoded position" do
      user.should have_same_position_as TOULON
    end
  
    it "should set boolean to true once user is created" do
      user.gmaps.should be_true
    end
  
    it "should render a valid json from an array of objects" do
      user #needed trigger the object from the let statement
      Factory(:user_paris)
      JSON.parse(User.all.to_gmaps4rails).should == [{ "lng" => TOULON[:longitude], "lat" => TOULON[:latitude] },{"lng" => PARIS[:longitude], "lat" => PARIS[:latitude] } ]
    end
    
    context "to_gmaps4rails block" do
      it "should extend json string for Arrays" do
        user #needed trigger the object from the let statement
        Factory(:user_paris)
        JSON.parse(User.all.to_gmaps4rails do |u, marker|
          '"model":"' + u.class.to_s + '"'
        end).should == [{"model" => "User", "lng" => TOULON[:longitude], "lat" => TOULON[:latitude]},{"model" => "User", "lng" => PARIS[:longitude], "lat" => PARIS[:latitude] }]
      end
      
      it "should extend json string for Arrays and custom hash" do
        user #needed trigger the object from the let statement
        Factory(:user_paris)
        JSON.parse(User.all.to_gmaps4rails do |u, marker|
           marker.json({ :model => u.class.to_s })
        end).should == [{"model" => "User", "lng" => TOULON[:longitude], "lat" => TOULON[:latitude]},{"model" => "User", "lng" => PARIS[:longitude], "lat" => PARIS[:latitude] }]
      end
            
      it "should extend json string for a single object" do
        JSON.parse(user.to_gmaps4rails do |u, marker|
          "\"model\":\"" + u.class.to_s + "\""
        end).should == [{ "model" => "User", "lng" =>TOULON[:longitude], "lat" => TOULON[:latitude] }]
      end
      
      it "json method should produce same result as raw string" do
        from_method = JSON.parse(user.to_gmaps4rails do |u, marker|
          marker.json({ :model => u.class.to_s })
        end)
        
        from_string = JSON.parse(user.to_gmaps4rails do |u, marker|
          "\"model\":\"" + u.class.to_s + "\""
        end)
        
        from_string.should eq from_method
      end
      
      it "infowindow content should be included in json" do
        user.to_gmaps4rails do |u, marker|
          marker.infowindow "in infowindow"
        end.should include "\"description\":\"in infowindow\""
      end
      
      it "marker_picture should be included in json" do
        user.to_gmaps4rails do |u, marker|
          marker.picture({
                          :picture => "http://www.blankdots.com/img/github-32x32.png",
                          :width   => "32",
                          :height  => "32"
                          })
        end.should include "\"picture\":\"http://www.blankdots.com/img/github-32x32.png\""
      end
      
      it "title content should be included in json" do
        user.to_gmaps4rails do |u, marker|
          marker.title "i'm the title"
        end.should include "\"title\":\"i'm the title\""
      end
      
      it "sidebar content should be included in json" do
        user.to_gmaps4rails do |u, marker|
          marker.sidebar "i'm the sidebar"
        end.should include "\"sidebar\":\"i'm the sidebar\""
      end
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
            user.should_receive :gmaps4rails_save_data
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
    it "should render a valid json from a single object" do
      JSON.parse(user.to_gmaps4rails).should == [{"lng" => TOULON[:longitude], "lat" => TOULON[:latitude] }]
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
    
  context "model customization" do

    it "should render a valid json even if there is no instance in the db" do
      User.all.to_gmaps4rails.should == "[]"
    end
    
    context "acts_as_gmappable options" do
     
      after(:all) do 
        #reset all configuration to default
        set_gmaps4rails_options!
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

    context "instance methods" do
      let(:user_with_pic) { Factory(:user_with_pic) }
      
      it "should take into account the description provided in the model" do
        user_with_pic.instance_eval do
          def gmaps4rails_infowindow
            "My Beautiful Picture: #{picture}"
          end
        end
        user_with_pic.to_gmaps4rails.should include "\"description\":\"My Beautiful Picture: http://www.blankdots.com/img/github-32x32.png\""
      end
    
      it "should take into account the picture provided in the model" do
        user.instance_eval do
          def gmaps4rails_marker_picture
            {
            "picture" => "http://www.blankdots.com/img/github-32x32.png",
            "width" => "32",
            "height" => "32"
            }
          end
        end
        result = user.to_gmaps4rails
        result.should include "\"picture\":\"http://www.blankdots.com/img/github-32x32.png\""
        result.should include "\"width\":\"32\"" 
        result.should include "\"height\":\"32\""
      end
      
      it "should take into account the picture and shadow provided in the model" do
        user.instance_eval do
          def gmaps4rails_marker_picture
            {
            "picture" => "http://www.blankdots.com/img/github-32x32.png",
            "width" => "32",
            "height" => "32",
            "marker_anchor" => [10, 20],
            "shadow_picture" => "http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag_shadow.png" ,
            "shadow_width" => "40",
            "shadow_height" => "40",
            "shadow_anchor" => [5, 10]
            }
          end
        end
        result = user.to_gmaps4rails
        result.should include "\"shadow_width\":\"40\""
        result.should include "\"shadow_height\":\"40\""
        result.should include "\"shadow_picture\":\"http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag_shadow.png\""
        result.should include "\"shadow_anchor\":[5,10]"
        result.should include "\"marker_anchor\":[10,20]"
      end
    
      it "should take into account the title provided in the model" do
        user.instance_eval do
          def gmaps4rails_title
            "Sweet Title"
          end
        end
        JSON.parse(user.to_gmaps4rails).should == [{"title" => "Sweet Title", "lng" => TOULON[:longitude], "lat" => TOULON[:latitude]}]
      end
    
      it "should take into account the sidebar content provided in the model" do
        user.instance_eval do
          def gmaps4rails_sidebar
            "sidebar content"
          end
        end
        user.to_gmaps4rails.should include "\"sidebar\":\"sidebar content\""
      end

      it "should take into account all additional data provided in the model" do
        user.instance_eval do
          def gmaps4rails_infowindow
            "My Beautiful Picture: #{picture}"
          end
        
          def gmaps4rails_marker_picture
            {
            "picture" => "http://www.blankdots.com/img/github-32x32.png",
            "width" => "32",
            "height" => "32"
            }
          end
        
          def gmaps4rails_title
            "Sweet Title"
          end
        
          def gmaps4rails_sidebar
            "sidebar content"
          end
        end
        result = user.to_gmaps4rails
        result.should include "\"description\":\"My Beautiful Picture: \""
        result.should include "\"title\":\"Sweet Title\""
        result.should include "\"sidebar\":\"sidebar content\""
        result.should include "\"picture\":\"http://www.blankdots.com/img/github-32x32.png\""
      end
      
    end

    it "block info should take precedence over model methods" do
      user.instance_eval do 
        def gmaps4rails_infowindow
          "defined in model"
        end
      end
      user.to_gmaps4rails.should include "defined in model"
      result = user.to_gmaps4rails do |u, marker|
        marker.infowindow "defined in block"
      end
      result.should     include "defined in block"
      result.should_not include "defined in model"
    end
    
    it "block info should take precedence over model methods, particular case: picture" do
      user.instance_eval do 
        def gmaps4rails_marker_picture
          {
           "picture" => "/model.png",
           "width" =>  32,
           "height" => 32}
        end
      end
      user.to_gmaps4rails.should include "model.png"
      result = user.to_gmaps4rails do |u, marker|
        marker.picture({
         "picture" => "/block.png",
         "width" =>  32,
         "height" => 32})
      end
      result.should     include "block.png"
      result.should_not include "model.png"
    end
    
  end
  
  describe "eval conditions" do
    it "should trigger method if symbol passed" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :validation => :published? })
        end

        def published?; true; end
      end
      user.should_receive :published?
      Gmaps4rails.condition_eval(user, user.gmaps4rails_options[:validation])
    end
    
    it "should evaluate lambda if provided" do
      user.instance_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :validation => lambda { |object| object.test_me(:foo, :bar) } })
        end
        
        def test_me(a,b)
          "#{a}, #{b}"
        end
      end
      user.should_receive(:test_me).with(:foo, :bar)
      Gmaps4rails.condition_eval(user, user.gmaps4rails_options[:validation])
    end
    
    it "should simply accept a true value" do
      user.instance_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :validation => true })
        end
      end
      Gmaps4rails.condition_eval(user, user.gmaps4rails_options[:validation]).should be_true
    end
    
    it "should simply accept a false value" do
      user.instance_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :validation => false })
        end
      end
      Gmaps4rails.condition_eval(user, user.gmaps4rails_options[:validation]).should be_false
    end
  end

end