require File.dirname(__FILE__) + '/../spec_helper'

describe "list creation", :js => true do
  
  it "should create the sidebar with list of users" do
    
    #first setup what the list should display    
    User.class_eval do
      def gmaps4rails_sidebar
        name
      end
    end
    
    Factory(:user, :name => "User1")
    Factory(:user, :name => "User2")
    
    visit test_list_path
    page.should have_content("User1")
    page.should have_content("User2")
  end
  
end

