require 'spec_helper'


class Configuration
  include Gmaps4railsHelper
end

describe Gmaps4rails::Config::YamlLoader do
  subject { Gmaps4rails::Config::YamlLoader.new }

  it 'should load a Hash from config file' do
    subject.load.should be_a Hash
  end  

  it 'should have a config_file' do
    subject.config_file.should == 'gmaps4rails.yml'
  end  

  it 'should have a config_path' do
    subject.config_path.to_s.should include('spec/dummy/config/gmaps4rails.yml')
  end  

  describe '#config_file = ' do
    let(:config_file) { 'gmaps.yml' }

    before :each do
      subject.config_file = config_file
    end

    it 'should set it' do
      subject.config_file.should == config_file
    end

    it 'should load an empty Hash if no matching config file' do
      subject.load.should == {}
    end
  end  
end

describe Gmaps4rails::Config do
  subject { Gmaps4rails.config }

  it 'should have a yaml loader' do
    subject.send(:yaml_loader).should be_a Gmaps4rails::Config::YamlLoader
  end

  it 'should load options from yaml file' do
    subject.options.should be_a Hash
    subject.options.should_not be_empty
  end

  it 'should load provider map_options from yaml file' do
    subject.options[:map_options][:provider].should == 'mapquest'
  end
end
