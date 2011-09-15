require 'spec_helper'

describe "Geocode" do

  it "should geocode properly an address" do
    Gmaps4rails.geocode("alaska").should be_an(Array)
  end
  
  it "should raise an error when address invalid" do
    lambda { Gmaps4rails.geocode("home")}.should raise_error Gmaps4rails::GeocodeStatus
  end
  
  it "should raise an error when net connection failed" #TODO: Damn, I don't know how to test that!

end

describe "JS building methods" do
  
  describe "constructor name retrieval" do
    it "should render google if nothing passed" do
      Gmaps4rails.get_constructor(nil).should eq "Gmaps4RailsGoogle()"
    end
    
    it "should render proper provider when provided" do
      options_hash = { "provider" => "bing" }
      Gmaps4rails.get_constructor(options_hash.with_indifferent_access).should eq "Gmaps4RailsBing()"
      
      options_hash = { "provider" => "mapquest" }
      Gmaps4rails.get_constructor(options_hash.with_indifferent_access).should eq "Gmaps4RailsMapquest()"
      
      options_hash = { "provider" => "openlayers" }
      Gmaps4rails.get_constructor(options_hash.with_indifferent_access).should eq "Gmaps4RailsOpenlayers()"
    end
  end
  
  describe "map ID retrieval" do
    it "should return the default ID when nothing is passed" do
      options_hash = nil
      Gmaps4rails.get_map_id(options_hash).should eq Gmaps4rails::DEFAULT_MAP_ID
    end
  
    it "should return the default ID when no id is passed within map_options" do
      options_hash = { "foo" => "bar" }
      Gmaps4rails.get_map_id(options_hash).should eq Gmaps4rails::DEFAULT_MAP_ID
    end
  
    it "should return the proper ID when id passed" do
      options_hash = { "id" => "foo" }
      Gmaps4rails.get_map_id(options_hash.with_indifferent_access).should eq "foo"    
    end
  
  end
end

describe "to_gmaps4rails for hash" do  
  it "should accept hashes with indifferent access" do
    hash1 = {:markers => {:data => @json, :options => {:do_clustering => true, :draggable => true  } }}
    hash2 = {"markers" => {"data" => @json, "options" => {"do_clustering" => true, "draggable" => true  } }}
    hash1.to_gmaps4rails.should eq hash2.to_gmaps4rails
  end
    
  it "should format entries properly" do
     options_hash = {
        "map_options" => { "type" => "SATELLITE", "center_longitude" => 180, "zoom" => 3, :raw => '{ok: true}'},
        "markers"     => { "data" => '[{ "description": "", "title": "", "longitude": "5.9311119", "latitude": "43.1251606", "picture": "", "width": "", "height": "" } ,{ "description": "", "title": "", "longitude": "2.3509871", "latitude": "48.8566667", "picture": "", "width": "", "height": "" } ]',
                           :options => { :raw => '{ok: true}' } },
        "polylines"   => { "data" => '[[
{"longitude": -122.214897, "latitude": 37.772323},
{"longitude": -157.821856, "latitude": 21.291982},
{"longitude": 178.431, "latitude": -18.142599},
{"longitude": 153.027892, "latitude": -27.46758}
],
[
{"longitude": -120.214897, "latitude": 30.772323, "strokeColor": "#000", "strokeWeight" : 2 },
{"longitude": -10.821856, "latitude": 50.291982}
]]' },
         "polygons"    => { "data" => '[[
{"longitude": -80.190262, "latitude": 25.774252},
{"longitude": -66.118292, "latitude": 18.466465},
{"longitude": -64.75737, "latitude": 32.321384}
]]' },
         "circles"     => { "data" => '[
{"longitude": -122.214897, "latitude": 37.772323, "radius": 1000000},
{"longitude": 122.214897, "latitude": 37.772323, "radius": 1000000, "strokeColor": "#FF0000"}
]',
                          },
         "direction"   => { 
                  "data"    => { "from" => "toulon, france", "to" => "paris, france"} , 
                  "options" => {"waypoints" => ["toulouse, france", "brest, france"], "travelMode" => "DRIVING", "display_panel" => true, "panel_id" => "instructions"}
                },
         :kml          => {:data => '[{ url: "http://www.searcharoo.net/SearchKml/newyork.kml"}, { url: "http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml", options: {clickable: false } }]' }
      }
    result = options_hash.to_gmaps4rails
    #map
    result.should include "Gmaps.map = new Gmaps4RailsGoogle();"
    result.should include "Gmaps.map.map_options.center_longitude = 180;\nGmaps.map.map_options.type = 'SATELLITE';\nGmaps.map.map_options.raw = {ok: true};\nGmaps.map.map_options.zoom = 3;\nGmaps.map.initialize();"
    #result.should initialize ""
    #polylines
    result.should include "Gmaps.map.polylines = [[\n{\"longitude\": -122.214897, \"latitude\": 37.772323},\n{\"longitude\": -157.821856, \"latitude\": 21.291982},\n{\"longitude\": 178.431, \"latitude\": -18.142599},\n{\"longitude\": 153.027892, \"latitude\": -27.46758}\n],\n[\n{\"longitude\": -120.214897, \"latitude\": 30.772323, \"strokeColor\": \"#000\", \"strokeWeight\" : 2 },\n{\"longitude\": -10.821856, \"latitude\": 50.291982}\n]];\nGmaps.map.create_polylines();"
    #circles
    result.should include "Gmaps.map.circles = [\n{\"longitude\": -122.214897, \"latitude\": 37.772323, \"radius\": 1000000},\n{\"longitude\": 122.214897, \"latitude\": 37.772323, \"radius\": 1000000, \"strokeColor\": \"#FF0000\"}\n];\nGmaps.map.create_circles();"
    #polygons
    result.should include "Gmaps.map.polygons = [[\n{\"longitude\": -80.190262, \"latitude\": 25.774252},\n{\"longitude\": -66.118292, \"latitude\": 18.466465},\n{\"longitude\": -64.75737, \"latitude\": 32.321384}\n]];\nGmaps.map.create_polygons();"
    #markers
    result.should include "Gmaps.map.markers = [{ \"description\": \"\", \"title\": \"\", \"longitude\": \"5.9311119\", \"latitude\": \"43.1251606\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ,{ \"description\": \"\", \"title\": \"\", \"longitude\": \"2.3509871\", \"latitude\": \"48.8566667\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ];\nGmaps.map.markers_conf.raw = {ok: true};\nGmaps.map.create_markers();"
    #directions
    result.should include "Gmaps.map.direction_conf.origin = 'toulon, france';\nGmaps.map.direction_conf.destination = 'paris, france';"
    result.should include "Gmaps.map.direction_conf.display_panel = true;"
    result.should include "Gmaps.map.direction_conf.panel_id = 'instructions';"
    result.should include "Gmaps.map.direction_conf.travelMode = 'DRIVING';"
    result.should include "Gmaps.map.direction_conf.waypoints = [{\"stopover\":true,\"location\":\"toulouse, france\"},{\"stopover\":true,\"location\":\"brest, france\"}];"
    result.should include "Gmaps.map.create_direction();"
    #kml
    result.should include "Gmaps.map.kml = [{ url: \"http://www.searcharoo.net/SearchKml/newyork.kml\"}, { url: \"http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml\", options: {clickable: false } }];\nGmaps.map.create_kml();"
    #callback
    result.should include "Gmaps.map.callback();"
  end 
  
  it "should not call map builder if not last_map" do
    hash = {:last_map => false}
    hash.to_gmaps4rails.should_not include "window.onload = Gmaps.loadMaps;"
  end
  
  it "should call map builder if last_map" do
    hash = {:last_map => true}
    hash.to_gmaps4rails.should include "window.onload = function() { Gmaps.loadMaps(); };"
    hash = {}
    hash.to_gmaps4rails.should include "window.onload = function() { Gmaps.loadMaps(); };"
  end
end

describe "Destination" do
  it "should render info from only start_end args"
  it "should accept all options properly"
  it "should format output in accordance with 'output' variable"
end
