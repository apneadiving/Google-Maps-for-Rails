Gmaps4Rails.map_options.center_longitude = 180;
Gmaps4Rails.map_options.type = 'SATELLITE';
Gmaps4Rails.map_options.zoom = 3;
Gmaps4Rails.initialize();
Gmaps4Rails.polylines = [[
{\"longitude\": -122.214897, \"latitude\": 37.772323},
{\"longitude\": -157.821856, \"latitude\": 21.291982},
{\"longitude\": 178.431, \"latitude\": -18.142599},
{\"longitude\": 153.027892, \"latitude\": -27.46758}
],
[
{\"longitude\": -120.214897, \"latitude\": 30.772323, \"strokeColor\": \"#000\", \"strokeWeight\" : 2 },
{\"longitude\": -10.821856, \"latitude\": 50.291982}
]];
Gmaps4Rails.create_polylines();
Gmaps4Rails.circles = [
{\"longitude\": -122.214897, \"latitude\": 37.772323, \"radius\": 1000000},
{\"longitude\": 122.214897, \"latitude\": 37.772323, \"radius\": 1000000, \"strokeColor\": \"#FF0000\"}
];
Gmaps4Rails.create_circles();
Gmaps4Rails.polygons = [[
{\"longitude\": -80.190262, \"latitude\": 25.774252},
{\"longitude\": -66.118292, \"latitude\": 18.466465},
{\"longitude\": -64.75737, \"latitude\": 32.321384}
]];
Gmaps4Rails.create_polygons();
Gmaps4Rails.markers = [{ \"description\": \"\", \"title\": \"\", \"longitude\": \"5.9311119\", \"latitude\": \"43.1251606\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ,{ \"description\": \"\", \"title\": \"\", \"longitude\": \"2.3509871\", \"latitude\": \"48.8566667\", \"picture\": \"\", \"width\": \"\", \"height\": \"\" } ];
Gmaps4Rails.create_markers();
Gmaps4Rails.direction_conf.origin = 'toulon, france';
Gmaps4Rails.direction_conf.destination = 'paris, france';
Gmaps4Rails.direction_conf.display_panel = 'true';
Gmaps4Rails.direction_conf.panel_id = 'instructions';
Gmaps4Rails.direction_conf.travelMode = 'DRIVING';
Gmaps4Rails.direction_conf.waypoints = [{\"stopover\":true,\"location\":\"toulouse, france\"},{\"stopover\":true,\"location\":\"brest, france\"}];
Gmaps4Rails.create_direction();