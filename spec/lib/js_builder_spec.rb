require 'spec_helper'

describe "to_gmaps4rails for hash" do  
  it "should accept hashes with indifferent access" do
    hash1 = {:markers => {:data => @json, :options => {:do_clustering => true, :draggable => true  } }}
    hash2 = {"markers" => {"data" => @json, "options" => {"do_clustering" => true, "draggable" => true  } }}
    hash1.to_gmaps4rails.should eq hash2.to_gmaps4rails
  end
  
  context "rendered js" do
    it "should format polygons" do
      expected_polygons = '[[
        {"longitude": -80.190262, "latitude": 25.774252},
        {"longitude": -66.118292, "latitude": 18.466465},
        {"longitude": -64.75737, "latitude": 32.321384}
      ]]'
      options_hash = {
        :polygons    => { :data => expected_polygons }
      }
      result = options_hash.to_gmaps4rails
      actual_polygons = result.scan(/Gmaps\.map\.polygons = (.*?);/m).first.first
      
      actual_polygons.should be_same_json_as expected_polygons
      result.should          include "Gmaps.map.create_polygons();"
    end

    it "should format polylines" do
      expected_polylines = '[[
        {"longitude": -122.214897, "latitude": 37.772323},
        {"longitude": -157.821856, "latitude": 21.291982},
        {"longitude": 178.431, "latitude": -18.142599},
        {"longitude": 153.027892, "latitude": -27.46758}
        ],
        [
        {"longitude": -120.214897, "latitude": 30.772323, "strokeColor": "#000", "strokeWeight" : 2 },
        {"longitude": -10.821856, "latitude": 50.291982}
      ]]'
      options_hash = {
        :polylines    => { :data => expected_polylines }
      }
      result = options_hash.to_gmaps4rails
      actual_polylines = result.scan(/Gmaps\.map\.polylines = (.*?);/m).first.first
      
      actual_polylines.should be_same_json_as expected_polylines
      result.should          include "Gmaps.map.create_polylines();"
    end
    
    it "should format circles" do
      expected_circles = '[
        {"longitude": -122.214897, "latitude": 37.772323, "radius": 1000000},
        {"longitude": 122.214897, "latitude": 37.772323, "radius": 1000000, "strokeColor": "#FF0000"}
      ]'
      options_hash = {
        :circles    => { :data => expected_circles }
      }
      result = options_hash.to_gmaps4rails
      actual_circles = result.scan(/Gmaps\.map\.circles = (.*?);/m).first.first
      
      actual_circles.should be_same_json_as expected_circles
      result.should         include "Gmaps.map.create_circles();"
    end
    
    it "should format markers" do
      expected_markers = '[{ "description": "", "title": "", "longitude": "5.9311119", "latitude": "43.1251606", "picture": "", "width": "", "height": "" } ,{ "description": "", "title": "", "longitude": "2.3509871", "latitude": "48.8566667", "picture": "", "width": "", "height": "" } ]'
      options_hash = {
        :markers    => { :data => expected_markers }
      }
      result = options_hash.to_gmaps4rails
      actual_markers = result.scan(/Gmaps\.map\.markers = (.*?);/m).first.first
      
      actual_markers.should be_same_json_as expected_markers
      result.should         include "Gmaps.map.create_markers();"
    end
    
    it "should format map" do
      options_hash = {
        :map_options => { :type => "SATELLITE", :center_longitude => 180, "zoom" => 3, :raw => '{ok: true}'}
      }
      result = options_hash.to_gmaps4rails
      
      result.should include "Gmaps.map = new Gmaps4RailsGoogle();"
      result.should include "Gmaps.map.map_options.center_longitude = 180;"
      result.should include "Gmaps.map.map_options.type = \"SATELLITE\""
      result.should include "Gmaps.map.map_options.raw = {ok: true};"
      result.should include "Gmaps.map.map_options.zoom = 3;"
      result.should include "Gmaps.map.initialize();"
    end
    
    it "should invoke callback" do
      result = {}.to_gmaps4rails
      result.should include "Gmaps.map.callback();"
    end
    
    it "should format kml" do
      expected_kml = '[{ url: "http://www.searcharoo.net/SearchKml/newyork.kml"}, { url: "http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml", options: {clickable: false } }]'
      options_hash = {
        :kml          => {:data => expected_kml }
      }
      result = options_hash.to_gmaps4rails
      actual_kml = result.scan(/Gmaps\.map\.kml = (.*?);/m).first.first
      
      actual_kml.should eq expected_kml
      result.should     include "Gmaps.map.create_kml();"
    end
    
    it "should format directions" do
      options_hash = {
        "direction"   => { 
          "data"    => { "from" => "toulon, france", "to" => "paris, france"} , 
          "options" => {"waypoints" => ["toulouse, france", "brest, france"], "travelMode" => "DRIVING", "display_panel" => true, "panel_id" => "instructions"}
        }
      }      
      result = options_hash.to_gmaps4rails
      result.should include "Gmaps.map.direction_conf.origin = 'toulon, france';\nGmaps.map.direction_conf.destination = 'paris, france';"
      result.should include "Gmaps.map.direction_conf.display_panel = true;"
      result.should include "Gmaps.map.direction_conf.panel_id = \"instructions\";"
      result.should include "Gmaps.map.direction_conf.travelMode = \"DRIVING\";"
      result.should include "Gmaps.map.create_direction();"

      actual_directions = result.scan(/Gmaps\.map\.direction_conf\.waypoints = (.*?);/m).first.first
      actual_directions.should be_same_json_as "[{\"stopover\":true,\"location\":\"toulouse, france\"},{\"stopover\":true,\"location\":\"brest, france\"}]"
    end
    
    it "should not call map builder if not last_map" do
      hash = {:last_map => false}
      hash.to_gmaps4rails.should_not include "window.onload"
    end

    it "should call map builder if last_map" do
      trigger_script = "Gmaps.oldOnload = window.onload;\n window.onload = function() { Gmaps.triggerOldOnload(); Gmaps.loadMaps(); };"
      hash = {:last_map => true}
      hash.to_gmaps4rails.should include trigger_script
      hash = {}
      hash.to_gmaps4rails.should include trigger_script
    end
    
  end
  
end
