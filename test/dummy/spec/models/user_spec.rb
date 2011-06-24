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

#reset all configuration to default
User.class_eval do
  def gmaps4rails_options
    DEFAULT_CONFIG_HASH
  end
end

describe "Acts as gmappable" do
  
  let(:paris) { { :latitude => 48.856614, :longitude => 2.3522219 } }
  let(:toulon) { { :latitude => 43.124228, :longitude => 5.928} }
  
  describe "standard configuration, valid user" do
    
    let(:user) { Factory(:user) }
    
    it "should have a geocoded position" do
      user.should have_same_position_as toulon
    end
  
    it "should set boolean to true once user is created" do
      user.gmaps.should be_true
    end
  
    it "should render a valid json from an array of ojects" do
      user #needed trigger the object from the let statement
      @user2 = Factory(:user_paris)
      User.all.to_gmaps4rails.should == "[{\"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\"},\n{\"longitude\": \"" + paris[:longitude].to_s + "\", \"latitude\": \"" + paris[:latitude].to_s + "\"}]"
    end
  
    it "should render a valid json from a single object" do
      user.to_gmaps4rails.should == "[{\"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\"}]"
    end
    
    it "should not geocode again after address changes if checker is true" do
      user.sec_address = "paris, France"
      user.save
      user.should have_same_position_as toulon
    end
    
    it "should geocode after address changes if checker is false" do
      user.sec_address = "paris, France"
      user.gmaps = false
      user.save
      user.should have_same_position_as paris
    end
  end
  
  
  describe "standard configuration, invalid address" do

    let(:user) { Factory.build(:invalid_user) }
    
    it "should raise an error if validation option is turned on and address incorrect" do
      user.should_not be_valid, "Address invalid"
    end
    
    it "should not set boolean to true when address update fails" do
      user.gmaps.should_not be_true
    end
  end
  
  
  describe "model customization" do
    
    it "should render a valid json even if there is no instance in the db" do
      User.all.to_gmaps4rails.should == "[]"
    end
    
    it "should use indifferently a db column for address if passed in config" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({:address => "sec_address"})
        end
      end
      @user = Factory(:user)
      @user.should have_same_position_as toulon
    end
    
    it "should save the normalized address if requested" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :normalized_address => "norm_address" })
        end
      end
      @user = Factory(:user)
      @user.norm_address.should == "Toulon, France"
    end
    
    it "should override user's address with normalized address if requested" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :normalized_address => "sec_address" })
        end
      end
      @user = Factory(:user, :sec_address => "ToUlOn, FrAnCe")
      @user.sec_address.should == "Toulon, France"
    end
    
    it "should display the proper error message when address is invalid" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :msg => "Custom Address invalid"})
        end
      end
      @user = Factory.build(:invalid_user)
      @user.should_not be_valid, "Custom Address invalid"
    end
  
    it "should not raise an error if validation option is turned off" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :validation => false })
        end
      end
      @user = Factory.build(:invalid_user)
      @user.should be_valid
    end
    
    it "should save longitude and latitude to the customized columns" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({
                                      :lat_column     => "lat_test",
                                      :lng_column     => "long_test"
                                    })
        end
      end
      @user = Factory(:user)
      @user.lat_test.should  == toulon[:latitude]
      @user.long_test.should == toulon[:longitude]
      @user.should have_same_position_as({ :latitude => nil, :longitude => nil })
    end
    
    it "should not save the boolean if check_process is false" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :check_process  => false })
        end
      end
      @user = Factory(:user)
      @user.gmaps.should be_nil
    end
    
    it "should geocode after each save if 'check_process' is false" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :check_process  => false })
        end
      end
      @user = Factory(:user)
      @user.sec_address = "paris, France"
      @user.save
      @user.should have_same_position_as paris
    end
    
    it "should save to the proper boolean checker set in checker" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ :checker => "bool_test" })
        end
      end
      @user = Factory(:user)
      @user.gmaps.should be_nil
      @user.bool_test.should be_true
    end
    
    it "should take into account the description provided in the model" do
      @user = Factory(:user_with_pic)
      @user.class_eval do
        def gmaps4rails_infowindow
          "My Beautiful Picture: #{picture}"
        end
      end
      @user.to_gmaps4rails.should == "[{\"description\": \"My Beautiful Picture: http://www.blankdots.com/img/github-32x32.png\", \"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\"}]"
    end
    
    it "should take into account the picture provided in the model" do
      @user = Factory(:user)
      @user.class_eval do
        def gmaps4rails_marker_picture
          {
          "picture" => "http://www.blankdots.com/img/github-32x32.png",
          "width" => "32",
          "height" => "32"
          }
        end
      end
      @user.to_gmaps4rails.should == "[{\"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\", \"picture\": \"http://www.blankdots.com/img/github-32x32.png\", \"width\": \"32\", \"height\": \"32\"}]"
    end
    
    it "should take into account the title provided in the model" do
      @user = Factory(:user)
      @user.class_eval do
        def gmaps4rails_title
          "Sweet Title"
        end
      end
      @user.to_gmaps4rails.should == "[{\"title\": \"Sweet Title\", \"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\"}]"
    end
    
    it "should take into account the sidebar content provided in the model" do
      @user = Factory(:user)
      @user.class_eval do
        def gmaps4rails_sidebar
          "sidebar content"
        end
      end
      @user.to_gmaps4rails.should == "[{\"sidebar\": \"sidebar content\",\"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\"}]"
    end
    
    it "should take into account all additional data provided in the model" do
      @user = Factory(:user)
      
      @user.instance_eval do
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
      @user.to_gmaps4rails.should == "[{\"description\": \"My Beautiful Picture: \", \"title\": \"Sweet Title\", \"sidebar\": \"sidebar content\",\"longitude\": \"" + toulon[:longitude].to_s + "\", \"latitude\": \"" + toulon[:latitude].to_s + "\", \"picture\": \"http://www.blankdots.com/img/github-32x32.png\", \"width\": \"32\", \"height\": \"32\"}]"
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
      @user = Factory(:user)
      @user.called_back.should be_true
    end
    
    it "should return results in the specified language" do
      User.class_eval do
        def gmaps4rails_options
          DEFAULT_CONFIG_HASH.merge({ 
                                      :language   => "de",
                                      :normalized_address => "norm_address"
                                    })
        end
      end
      @user = Factory(:user)
      @user.norm_address.should == "Toulon, Frankreich"
    end
  end

end