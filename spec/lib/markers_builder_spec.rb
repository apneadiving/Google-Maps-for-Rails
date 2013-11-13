require 'spec_helper'
require './lib/gmaps4rails/markers_builder'

describe Gmaps4rails::MarkersBuilder do

  describe "call" do
    let(:lat) { 40 }
    let(:lng) { 5  }
    let(:id)  { 'id' }
    let(:infowindow) { 'some infowindow content' }
    let(:name)       { 'name' }
    let(:picture)    { {
      :url    => "http://www.blankdots.com/img/github-32x32.png",
      :width  => "32",
      :height => "32"
    }}
    let(:shadow) { {
      :url    => "shadow",
      :width  => "30",
      :height => "30"
    } }
    let(:expected_hash) { {
      :lat          => lat,
      :lng          => lng,
      :marker_title => name,
      :some_id      => id,
      :infowindow   => infowindow,
      :picture      => picture,
      :shadow       => shadow
    }}
    let(:object) { OpenStruct.new(
      :latitude  => lat,
      :longitude => lng,
      :name      => name,
      :some_id   => id
    )}

    let(:action) { Gmaps4rails::MarkersBuilder.new(object).call do |user, marker|
        marker.lat        user.latitude
        marker.lng        user.longitude
        marker.infowindow infowindow
        marker.picture    picture
        marker.shadow     shadow
        marker.title      user.name
        marker.json({ :some_id => user.some_id })
      end
    }

    it "creates expected hash" do
      expect(action).to eq [expected_hash]
    end

  end


end
