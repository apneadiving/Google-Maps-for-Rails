require 'spec_helper'

include Geocoding

set_gmaps4rails_options!

describe "condition_eval" do
  
  let(:user)         { Factory(:user) }
  
  before(:each) do
    Geocoding.stub_geocoding
  end
  
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

