require 'spec_helper'

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
    let(:expected_hash) { {
      :lat          => lat,
      :lng          => lng,
      :marker_title => name,
      :id           => id,
      :infowindow   => infowindow,
      :picture      => picture
    }}
    let(:object) { OpenStruct.new(
      :latitude  => lat,
      :longitude => lng,
      :name      => name,
      :id        => id
    )}

    let(:action) { Gmaps4rails::MarkersBuilder.new(object).call do |user, marker|
        marker.lat        user.latitude
        marker.lng        user.longitude
        marker.infowindow infowindow
        marker.picture    picture
        marker.title      user.name
        marker.json({ :id => user.id })
      end
    }

    it "creates expected hash" do
      expect(action).to eq [expected_hash]
    end

  end


end
