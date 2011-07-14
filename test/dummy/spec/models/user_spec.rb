require File.dirname(__FILE__) + '/../spec_helper'

DEFAULT_CONFIG_HASH = {
  :lat_column     => "latitude",
  :lng_column     => "longitude",
  :check_process  => true,
  :checker        => "gmaps",
  :msg            => "Address invalid",
  :validation     => true,
  :address    => "gmaps4rails_address",
  :language   => "en"
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
  
  context "standard configuration, valid user" do  
    
    it "should have a geocoded position" do
      user.should have_same_position_as TOULON
    end
  
    it "should set boolean to true once user is created" do
      user.gmaps.should be_true
    end
  
    it "should render a valid json from an array of objects" do
      user #needed trigger the object from the let statement
      Factory(:user_paris)
      User.all.to_gmaps4rails.should == "[{\"lng\": \"" + TOULON[:longitude].to_s + "\", \"lat\": \"" + TOULON[:latitude].to_s + "\"},\n{\"lng\": \"" + PARIS[:longitude].to_s + "\", \"lat\": \"" + PARIS[:latitude].to_s + "\"}]"
    end
    
    it "should accept additional block for an array of objects" do
      user #needed trigger the object from the let statement
      Factory(:user_paris)
      User.all.to_gmaps4rails do |u|
        "\"model\": \"" + u.class.to_s + "\""
      end.should == "[{\"lng\": \"" + TOULON[:longitude].to_s + "\", \"lat\": \"" + TOULON[:latitude].to_s + "\", \"model\": \"User\"},\n{\"lng\": \"" + PARIS[:longitude].to_s + "\", \"lat\": \"" + PARIS[:latitude].to_s + "\", \"model\": \"User\"}]"
    end
  
    it "should accept additional block for a single object" do
      user.to_gmaps4rails do |u|
        "\"model\": \"" + u.class.to_s + "\""
      end.should == "[{\"lng\": \"" + TOULON[:longitude].to_s + "\", \"lat\": \"" + TOULON[:latitude].to_s + "\", \"model\": \"User\"}]"
    end
    
    it "should render a valid json from a single object" do
      user.to_gmaps4rails.should == "[{\"lng\": \"" + TOULON[:longitude].to_s + "\", \"lat\": \"" + TOULON[:latitude].to_s + "\"}]"
    end
    
    it "should not geocode again after address changes if checker is true" do
      user.update_attributes({ :sec_address => "PARIS, France" })
      user.should have_same_position_as TOULON
    end
    
    it "should geocode after address changes if checker is false" do
      user.update_attributes({ :sec_address => "PARIS, France", 
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
        invalid_user.errors[:gmaps4rails_address].should include("Custom Address invalid")
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
        user = Factory(:user, :sec_address => "PARIS, France")
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

      it "should return results in the specified language" do
        set_gmaps4rails_options!({ 
                                :language   => "de",
                                :normalized_address => "norm_address"
                                })
        user.norm_address.should == "Toulon, Frankreich"
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
        user_with_pic.to_gmaps4rails.should include "\"description\": \"My Beautiful Picture: http://www.blankdots.com/img/github-32x32.png\""
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
        result.should include "\"picture\": \"http://www.blankdots.com/img/github-32x32.png\""
        result.should include "\"width\": \"32\"" 
        result.should include "\"height\": \"32\""
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
        result.should include "\"shadow_width\": \"40\""
        result.should include "\"shadow_height\": \"40\""
        result.should include "\"shadow_picture\": \"http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag_shadow.png\""
        result.should include "\"shadow_anchor\": [5, 10]"
        result.should include "\"marker_anchor\": [10, 20]"
      end
    
      it "should take into account the title provided in the model" do
        user.instance_eval do
          def gmaps4rails_title
            "Sweet Title"
          end
        end
        user.to_gmaps4rails.should == "[{\"title\": \"Sweet Title\", \"lng\": \"" + TOULON[:longitude].to_s + "\", \"lat\": \"" + TOULON[:latitude].to_s + "\"}]"
      end
    
      it "should take into account the sidebar content provided in the model" do
        user.instance_eval do
          def gmaps4rails_sidebar
            "sidebar content"
          end
        end
        user.to_gmaps4rails.should include "\"sidebar\": \"sidebar content\""
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
        result.should include "\"description\": \"My Beautiful Picture: \""
        result.should include "\"title\": \"Sweet Title\""
        result.should include "\"sidebar\": \"sidebar content\""
        result.should include "\"picture\": \"http://www.blankdots.com/img/github-32x32.png\""
      end
      
    end
  end

end