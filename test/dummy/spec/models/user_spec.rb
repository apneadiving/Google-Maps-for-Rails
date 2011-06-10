require File.dirname(__FILE__) + '/../spec_helper'

describe "Acts as gmappable" do
  
  before(:each) do 
    #reset all configuration to default or nil
    User.class_eval do
      def gmaps4rails_options
        {
          :lat_column     => "latitude",
          :lng_column     => "longitude",
          :check_process  => true,
          :checker        => "gmaps",
          :msg            => "Address invalid",
          :validation     => true,
          :address    => "gmaps4rails_address",
          :language   => "en"
        }
      end
    end
    @toulon = { :latitude => 43.124228, :longitude => 5.928}
    @paris = { :latitude => 48.856614, :longitude => 2.3522219}
  end
  
  describe "standard configuration, valid user" do
    before(:each) do
      @user = Factory(:user)
    end
    
    it "should have a geocoded position" do
      @user.latitude.should  == @toulon[:latitude]
      @user.longitude.should == @toulon[:longitude]
    end
  
    it "should set boolean to true once user is created" do
      @user.gmaps.should == true
    end
  
    it "should render a valid json from an array of ojects" do
      @user2 = Factory(:user_paris)
      User.all.to_gmaps4rails.should == "[{\"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\"},\n{\"longitude\": \"" + @paris[:longitude].to_s + "\", \"latitude\": \"" + @paris[:latitude].to_s + "\"}]"
    end
  
    it "should render a valid json from a single object" do
      @user.to_gmaps4rails.should == "[{\"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\"}]"
    end
    
    it "should not geocode again after address changes if checker is true" do
      @user.sec_address = "paris, France"
      @user.save
      @user.latitude.should  == @toulon[:latitude]
      @user.longitude.should == @toulon[:longitude]
    end
    
    it "should geocode after address changes if checker is false" do
      @user.sec_address = "paris, France"
      @user.gmaps = false
      @user.save
      @user.latitude.should  == @paris[:latitude]
      @user.longitude.should == @paris[:longitude]
    end
  end
  
  
  describe "standard configuration, invalid address" do
    before(:each) do
      @user = Factory.build(:invalid_user)
    end
    
    it "should raise an error if validation option is turned on and address incorrect" do
      @user.should_not be_valid, "Address invalid"
    end
    
    it "should not set boolean to true when address update fails" do
      @user.gmaps.should_not == true
    end
  end
  
  
  describe "model customization" do
    
    it "should render a valid json even if there is no instance in the db" do
      User.all.to_gmaps4rails.should == "[]"
    end
    
    it "should use indifferently a db column for address if passed in config" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "sec_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.latitude.should  == @toulon[:latitude]
      @user.longitude.should == @toulon[:longitude]
    end
    
    it "should save the normalized address if requested" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :normalized_address => "norm_address",
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.norm_address.should == "Toulon, France"
    end
    
    it "should override user's address with normalized address if requested" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Custom Address invalid",
            :validation     => true,
            :normalized_address => "sec_address",
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory.build(:user)
      @user.sec_address.should == "Toulon, France"
    end
    
    it "should display the proper error message when address is invalid" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Custom Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory.build(:invalid_user)
      @user.should_not be_valid, "Custom Address invalid"
    end
  
    it "should not raise an error if validation option is turned off" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => false,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory.build(:invalid_user)
      @user.should be_valid
    end
    
    it "should save longitude and latitude to the customized columns" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "lat_test",
            :lng_column     => "long_test",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.lat_test.should  == @toulon[:latitude]
      @user.long_test.should == @toulon[:longitude]
      @user.longitude.should == nil
      @user.latitude.should  == nil
    end
    
    it "should not save the boolean if check_process is false" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "lat_test",
            :lng_column     => "long_test",
            :check_process  => false,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.gmaps.should == nil
    end
    
    it "should geocode after each save if 'check_process' is false" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => false,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.sec_address = "paris, France"
      @user.save
      @user.latitude.should  == @paris[:latitude]
      @user.longitude.should == @paris[:longitude]
    end
    
    it "should save to the proper boolean checker set in checker" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "lat_test",
            :lng_column     => "long_test",
            :check_process  => true,
            :checker        => "bool_test",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en"
          }
        end
      end
      @user = Factory(:user)
      @user.gmaps.should == nil
      @user.bool_test.should == true
    end
    
    it "should take into account the description provided in the model" do
      @user = Factory(:user_with_pic)
      @user.class_eval do
        def gmaps4rails_infowindow
          "My Beautiful Picture: #{picture}"
        end
      end
      @user.to_gmaps4rails.should == "[{\"description\": \"My Beautiful Picture: http://www.blankdots.com/img/github-32x32.png\", \"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\"}]"
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
      @user.to_gmaps4rails.should == "[{\"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\", \"picture\": \"http://www.blankdots.com/img/github-32x32.png\", \"width\": \"32\", \"height\": \"32\"}]"
    end
    
    it "should take into account the title provided in the model" do
      @user = Factory(:user)
      @user.class_eval do
        def gmaps4rails_title
          "Sweet Title"
        end
      end
      @user.to_gmaps4rails.should == "[{\"title\": \"Sweet Title\", \"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\"}]"
    end
    
    it "should take into account the sidebar content provided in the model" do
      @user = Factory(:user)
      @user.class_eval do
        def gmaps4rails_sidebar
          "sidebar content"
        end
      end
      @user.to_gmaps4rails.should == "[{\"sidebar\": \"sidebar content\",\"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\"}]"
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
      @user.to_gmaps4rails.should == "[{\"description\": \"My Beautiful Picture: \", \"title\": \"Sweet Title\", \"sidebar\": \"sidebar content\",\"longitude\": \"" + @toulon[:longitude].to_s + "\", \"latitude\": \"" + @toulon[:latitude].to_s + "\", \"picture\": \"http://www.blankdots.com/img/github-32x32.png\", \"width\": \"32\", \"height\": \"32\"}]"
    end
    
    it "should call a callback in the model if asked to" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "en",
            :callback   => "save_callback"
          }
        end
        
        def save_callback(data)
          self.called_back = true
        end
        
        attr_accessor :called_back
      end
      @user = Factory(:user)
      @user.called_back.should == true
    end
    
    it "should return results in the specified language" do
      User.class_eval do
        def gmaps4rails_options
          {
            :lat_column     => "latitude",
            :lng_column     => "longitude",
            :check_process  => true,
            :checker        => "gmaps",
            :msg            => "Address invalid",
            :validation     => true,
            :address    => "gmaps4rails_address",
            :language   => "de",
            :normalized_address => "norm_address"
          }
        end
      end
      @user = Factory(:user)
      @user.norm_address.should == "Toulon, Frankreich"
    end
  end

end