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

describe "JS creation from hash" do  

  it "should format entries properly" do
     options_hash = {
        "map_options" => { "type" => "SATELLITE", "center_longitude" => 180, "zoom" => 3},
        "markers"     => { "data" => '[{ "description": "", "title": "", "longitude": "5.9311119", "latitude": "43.1251606", "picture": "", "width": "", "height": "" } ,{ "description": "", "title": "", "longitude": "2.3509871", "latitude": "48.8566667", "picture": "", "width": "", "height": "" } ]' },
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
                          }
    }
    options_hash.to_gmaps4rails.should == "Gmaps4Rails.polylines = [[\n{\"longitude\": -122.214897, \"latitude\": 37.772323},\n{\"longitude\": -157.821856, \"latitude\": 21.291982},\n{\"longitude\": 178.431, \"latitude\": -18.142599},\n{\"longitude\": 153.027892, \"latitude\": -27.46758}\n],\n[\n{\"longitude\": -120.214897, \"latitude\": 30.772323, \"strokeColor\": \"#000\", \"strokeWeight\" : 2 },\n{\"longitude\": -10.821856, \"latitude\": 50.291982}\n]];\nGmaps4Rails.create_polylines();\nGmaps4Rails.circles = [\n{\"longitude\": -122.214897, \"latitude\": 37.772323, \"radius\": 1000000},\n{\"longitude\": 122.214897, \"latitude\": 37.772323, \"radius\": 1000000, \"strokeColor\": \"#FF0000\"}\n];\nGmaps4Rails.create_circles();\nGmaps4Rails.polygons = [[\n{\"longitude\": -80.190262, \"latitude\": 25.774252},\n{\"longitude\": -66.118292, \"latitude\": 18.466465},\n{\"longitude\": -64.75737, \"latitude\": 32.321384}\n]];\nGmaps4Rails.create_polygons();\nGmaps4Rails.markers = [{ \"description\": \"\", \"title\": \"\", \"longitude\": \"5.9311119\", \"latitude\": \"43.1251606\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ,{ \"description\": \"\", \"title\": \"\", \"longitude\": \"2.3509871\", \"latitude\": \"48.8566667\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ];\nGmaps4Rails.create_markers();\nGmaps4Rails.direction_conf.origin = 'toulon, france';\nGmaps4Rails.direction_conf.destination = 'paris, france';\nGmaps4Rails.direction_conf.display_panel = true;\nGmaps4Rails.direction_conf.panel_id = 'instructions';\nGmaps4Rails.direction_conf.travelMode = 'DRIVING';\nGmaps4Rails.direction_conf.waypoints = [{\"stopover\":true,\"location\":\"toulouse, france\"},{\"stopover\":true,\"location\":\"brest, france\"}];\nGmaps4Rails.create_direction();\nGmaps4Rails.callback();"
  end
  
  it "should add map settings when 'true' passed" do
     options_hash = {
        "map_options" => { "type" => "SATELLITE", "center_longitude" => 180, "zoom" => 3},
        "markers"     => { "data" => '[{ "description": "", "title": "", "longitude": "5.9311119", "latitude": "43.1251606", "picture": "", "width": "", "height": "" } ,{ "description": "", "title": "", "longitude": "2.3509871", "latitude": "48.8566667", "picture": "", "width": "", "height": "" } ]' },
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
                          }
    }
    options_hash.to_gmaps4rails(true).should == "Gmaps4Rails.map_options.center_longitude = 180;\nGmaps4Rails.map_options.type = 'SATELLITE';\nGmaps4Rails.map_options.zoom = 3;\nGmaps4Rails.initialize();\nGmaps4Rails.polylines = [[\n{\"longitude\": -122.214897, \"latitude\": 37.772323},\n{\"longitude\": -157.821856, \"latitude\": 21.291982},\n{\"longitude\": 178.431, \"latitude\": -18.142599},\n{\"longitude\": 153.027892, \"latitude\": -27.46758}\n],\n[\n{\"longitude\": -120.214897, \"latitude\": 30.772323, \"strokeColor\": \"#000\", \"strokeWeight\" : 2 },\n{\"longitude\": -10.821856, \"latitude\": 50.291982}\n]];\nGmaps4Rails.create_polylines();\nGmaps4Rails.circles = [\n{\"longitude\": -122.214897, \"latitude\": 37.772323, \"radius\": 1000000},\n{\"longitude\": 122.214897, \"latitude\": 37.772323, \"radius\": 1000000, \"strokeColor\": \"#FF0000\"}\n];\nGmaps4Rails.create_circles();\nGmaps4Rails.polygons = [[\n{\"longitude\": -80.190262, \"latitude\": 25.774252},\n{\"longitude\": -66.118292, \"latitude\": 18.466465},\n{\"longitude\": -64.75737, \"latitude\": 32.321384}\n]];\nGmaps4Rails.create_polygons();\nGmaps4Rails.markers = [{ \"description\": \"\", \"title\": \"\", \"longitude\": \"5.9311119\", \"latitude\": \"43.1251606\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ,{ \"description\": \"\", \"title\": \"\", \"longitude\": \"2.3509871\", \"latitude\": \"48.8566667\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ];\nGmaps4Rails.create_markers();\nGmaps4Rails.direction_conf.origin = 'toulon, france';\nGmaps4Rails.direction_conf.destination = 'paris, france';\nGmaps4Rails.direction_conf.display_panel = true;\nGmaps4Rails.direction_conf.panel_id = 'instructions';\nGmaps4Rails.direction_conf.travelMode = 'DRIVING';\nGmaps4Rails.direction_conf.waypoints = [{\"stopover\":true,\"location\":\"toulouse, france\"},{\"stopover\":true,\"location\":\"brest, france\"}];\nGmaps4Rails.create_direction();\nGmaps4Rails.callback();"
  end
end

describe "Hash extension" do
  
  it "should create the proper text (used as js)" do
     @options = {
            "map_options" => { "type" => "SATELLITE", "center_longitude" => 180, "zoom" => 3, "auto_adjust" => true},
            "markers"     => { "data" => '[{ "description": "", "title": "", "longitude": "5.9311119", "latitude": "43.1251606", "picture": "", "width": "", "height": "" } ,{ "description": "", "title": "", "longitude": "2.3509871", "latitude": "48.8566667", "picture": "", "width": "", "height": "" } ]',
            "options" => { "do_clustering" => false, "list_container" => "makers_list" } 
                        },
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
                    }
    }
  
    @options.to_gmaps4rails(true).should include "Gmaps4Rails.initialize();"
  end

end

describe "Destination" do
  it "should render info from only start_end args"
  it "should accept all options properly"
  it "should format output in accordance with 'output' variable"
end
