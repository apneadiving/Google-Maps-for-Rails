require File.dirname(__FILE__) + '/../spec_helper'

describe Gmaps4railsHelper do
  
  it "should create a string containing all desired libraries" do
    helper.gmaps4rails_js_libraries(["places", "foo", "bar"]).should eq(",places,foo,bar")
  end
  
  it "should render empty string if no library provided" do
    helper.gmaps4rails_js_libraries(nil).should eq("")
  end
  
end