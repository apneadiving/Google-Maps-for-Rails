require File.dirname(__FILE__) + '/../../spec_helper'

describe "users/test_partial.html.erb" do
  before(:each) do
    Factory :user
    Factory :user_paris
    assigns[:json] = User.all.to_gmaps4rails
    render
  end
  
  it "should contain proper default div properties" do
    rendered.should have_selector('div.map_container') do
      with_tag('div#map')
      with_tag('div.gmaps4rails')
    end
  end
  
  it "should render proper customized ids and class" do
    rendered.should have_selector('div.custom_container') do
      with_tag('div#custom_id')
      with_tag('div.custom_class')
    end    
  end
  
  it "should display proper bing's map default class" do
    rendered.should have_selector('div#bing') do
       with_tag('div#foo')
       with_tag('div.bing_map')
     end
  end

  context "content_for content" do
    
    before(:each) do
      #hack to access attr_readers      
      self.instance_eval do
        def get_partials; @partials; end
      end
      view.instance_eval do
        def get_content_for; @_content_for; end
      end
    end
    
    it "partial should have been inserted 5 times" do
      get_partials["_gmaps4rails"].should eq 5
    end
    
    it "all scripts should have only be inserted once" do
      [ 
        /http:\/\/maps.google.com\/maps\/api\/js/,
        /http:\/\/www.openlayers.org\/api/,
        /http:\/\/mapquestapi.com\/sdk\/js/,
        /http:\/\/ecn.dev.virtualearth.net/,
        /gmaps4rails.base.js/,
        /gmaps4rails.googlemaps.js/,
        /gmaps4rails.mapquest.js/,
        /gmaps4rails.bing.js/,
        /gmaps4rails.openlayers.js/
      ].each do |regexp|
          view.get_content_for[:scripts].scan(regexp).size.should eq 1
        end
    end
    
    it "css should only be inserted once" do
      view.get_content_for[:head].scan(/stylesheets\/gmaps4rails.css/).size.should eq 1      
    end
  end
  
end