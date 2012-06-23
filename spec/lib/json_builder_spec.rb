require 'spec_helper'

include Geocoding

set_gmaps4rails_options!

describe "Json Builder" do
  
  before(:each) do
    Geocoding.stub_geocoding
  end
  
  it "should render a valid json even if there is no instance in the db" do
    User.all.to_gmaps4rails.should == "[]"
  end
  
  context "standard configuration, valid user" do
    let!(:user) { Factory(:user) }
  
    it "should render a valid json from an array of objects" do
      Factory(:user_paris)
      JSON.parse(User.all.to_gmaps4rails).should == [{ "lng" => TOULON[:longitude], "lat" => TOULON[:latitude] },{"lng" => PARIS[:longitude], "lat" => PARIS[:latitude] } ]
    end

    it "should render a valid json from a single object" do
      JSON.parse(user.to_gmaps4rails).should == [{"lng" => TOULON[:longitude], "lat" => TOULON[:latitude] }]
    end
    
    describe "to_gmaps4rails block" do
      it "should extend json string for Arrays" do
        Factory(:user_paris)
        JSON.parse(User.all.to_gmaps4rails do |u, marker|
          '"model":"' + u.class.to_s + '"'
        end).should == [{"model" => "User", "lng" => TOULON[:longitude], "lat" => TOULON[:latitude]},{"model" => "User", "lng" => PARIS[:longitude], "lat" => PARIS[:latitude] }]
      end
      
      it "should extend json string for Arrays and custom hash" do
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
    
  end
    
  context "model customization" do
    let(:user) { Factory(:user) }
    
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

end