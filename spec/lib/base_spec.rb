require 'spec_helper'
require './lib/gmaps4rails'

describe Gmaps4rails do
  describe 'build_markers' do
    let(:collection)     { double 'collection' }
    let(:proc)           { lambda {} }
    let(:marker_builder) { double 'marker_builder' }

    it "delegates" do
      expect(::Gmaps4rails::MarkersBuilder).to receive(:new).with(collection).and_return marker_builder
      expect(marker_builder).to receive(:call)

      Gmaps4rails.build_markers collection, &proc
    end
  end
end
