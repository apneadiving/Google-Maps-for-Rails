require 'spec_helper'
require './lib/gmaps4rails'

describe Gmaps4rails do
  describe 'build_markers' do
    let(:collection)     { double 'collection' }
    let(:proc)           { lambda {} }
    let(:marker_builder) { double 'marker_builder' }

    it "delegates" do
      ::Gmaps4rails::MarkersBuilder.should_receive(:new).with(collection).and_return marker_builder
      marker_builder.should_receive(:call)

      Gmaps4rails.build_markers collection, &proc
    end
  end
end
