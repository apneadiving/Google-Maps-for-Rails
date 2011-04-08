google.load('maps', '3', { other_params: 'libraries=geometry&sensor=false' });

var Gmaps4Rails = {
	//map config
	map: null,									//contains the map we're working on
	visibleInfoWindow: null,
  
	//Map settings
	map_options: {
	  id: 'gmaps4rails_map',
	  type: "ROADMAP",        // HYBRID, ROADMAP, SATELLITE, TERRAIN
		center_latitude : 0,
		center_longitude : 0, 
		zoom : 1,
		maxZoom: null,
		minZoom: null,
		auto_adjust : false,        //adjust the map to the markers if set to true
		auto_zoom: true            //zoom given by auto-adjust
		},				
	
	//markers + info styling
	markers_conf: {
	  picture : "",
		width : 22,
		length : 32,
		//clustering config
	  do_clustering: true,			//do clustering if set to true
	  clusterer_gridSize: 50,		//the more the quicker but the less precise
		clusterer_maxZoom:  5,		//removes clusterer  at this zoom level
		randomize: false,         //Google maps can't display two markers which have the same coordinates. This randomizer enables to prevent this situation from happening.
		max_random_distance: 100, //in meters. Each marker coordinate could be altered by this distance in a random direction
		list_container : null     //id of the ul that will host links to all markers
		},
	
	//Stored variables
	marker_objects: [],				  //contains markers LatLng
	markers : [],							  //contains raw markers
	bounds: null,								//contains current bounds
	polygons: null, 						//contains raw data, array of arrays (first element cold be a hash containing options)
	polygon_objects: [],				//contains processed google.maps.Polygon
	polylines: null, 						//contains raw data, array of arrays (first element cold be a hash containing options)
	polyline_objects: [],				//contains processed google.maps.Polyline
	circles: null,              //contains raw data, array of hash
	circle_objects: [],			    //contains processed google.maps.Circle
	info_window : null,
  markerClusterer: null,			//contains all marker clusterers
  
	//Polygon Styling
	polygons_conf: {						//default style for polygons
		strokeColor: "#000",
  	strokeOpacity: 0.8,
  	strokeWeight: 2,
  	fillColor: "#000",
  	fillOpacity: 0.35
		},

	//Polyline Styling		
	polylines_conf: {						//default style for polylines
		strokeColor: "#FF0000",
  	strokeOpacity: 1,
  	strokeWeight: 2
		},
		
	//Circle Styling	
	circles_conf: {							//default style for circles
	  fillColor: "#000",
	  fillOpacity: 0.35,
		strokeColor: "#0000",
	  strokeOpacity: 0.8,
	  strokeWeight: 2
		},
	
	//Direction Settings
	direction_conf: {
		panel_id: 					null,
		display_panel: 			false,
		origin: 						null, 
    destination: 				null,
		waypoints: 					[], //[{location: "toulouse,fr", stopover: true}, {location: "Clermont-Ferrand, fr", stopover: true}]
    optimizeWaypoints: 	false,
		unitSystem: 				"METRIC", //IMPERIAL
		avoidHighways: 			false,
		avoidTolls: 				false,
		region: 						null, 
		travelMode: 				"DRIVING" //WALKING, BICYCLING
	},
	//initializes the map
	initialize: function(){
		this.map = new google.maps.Map(document.getElementById(this.map_options.id), {
			  maxZoom: this.map_options.maxZoom,
			  minZoom: this.map_options.minZoom,
				zoom: this.map_options.zoom,
				center: new google.maps.LatLng(this.map_options.center_latitude, this.map_options.center_longitude),
				mapTypeId: google.maps.MapTypeId[this.map_options.type]
		});
		//infowindow closes when user clicks on the map
		google.maps.event.addListener(this.map, 'click', function() 
			{ if (this.info_window != null) {this.info_window.close();} 
		});
		//variable used for Auto-adjust
		this.bounds = new google.maps.LatLngBounds();
		
		if(typeof gmaps4rails_callback == 'function') { 
		gmaps4rails_callback(); 
		}
	},
	
	create_direction: function(){
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();

		directionsDisplay.setMap(this.map);
		//display panel only if required
		if (this.direction_conf.display_panel) {	directionsDisplay.setPanel(document.getElementById(this.direction_conf.panel_id)); }
		directionsDisplay.setOptions({
			suppressMarkers: true,
			suppressInfoWindows: false,
			suppressPolylines: false
		});
	  var request = {
	        origin: 						this.direction_conf.origin, 
	        destination: 				this.direction_conf.destination,
					waypoints: 					this.direction_conf.waypoints,
	        optimizeWaypoints: 	this.direction_conf.optimizeWaypoints,
					unitSystem: 				google.maps.DirectionsUnitSystem[this.direction_conf.unitSystem],
					avoidHighways: 			this.direction_conf.avoidHighways,
					avoidTolls: 				this.direction_conf.avoidTolls,
					region: 						this.direction_conf.region, 
					travelMode: 				google.maps.DirectionsTravelMode[this.direction_conf.travelMode],
					language: 					"fr"
	    };
	   directionsService.route(request, function(response, status) {
	      if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
	      }
	    });
	},
	
	//Loops through all circles
	create_circles: function(){
		for (var i = 0; i < this.circles.length; ++i) {
			//by convention, default style configuration could be integrated in the first element
			if ( i == 0 )
			{
				if (this.exists(this.circles[i].strokeColor  )) { this.circles_conf.strokeColor 	= this.circles[i].strokeColor; 	 }
				if (this.exists(this.circles[i].strokeOpacity)) { this.circles_conf.strokeOpacity = this.circles[i].strokeOpacity; }
			  if (this.exists(this.circles[i].strokeWeight )) { this.circles_conf.strokeWeight 	= this.circles[i].strokeWeight;  }
			  if (this.exists(this.circles[i].fillColor 	 )) { this.circles_conf.fillColor 		= this.circles[i].fillColor; 		 }
			  if (this.exists(this.circles[i].fillOpacity  )) { this.circles_conf.fillOpacity 	= this.circles[i].fillOpacity; 	 }
			}
			if (this.exists(this.circles[i].latitude) && this.exists(this.circles[i].longitude))
			{
				 center = new google.maps.LatLng(this.circles[i].latitude, this.circles[i].longitude);
				 this.extend_bounds(center);
				 //always check if a config is given, if not, use defaults
				 var circle = new google.maps.Circle({
			   center:        center,
			   strokeColor:   this.circles[i].strokeColor   || this.circles_conf.strokeColor,
			   strokeOpacity: this.circles[i].strokeOpacity || this.circles_conf.strokeOpacity,
			   strokeWeight: 	this.circles[i].strokeWeight  || this.circles_conf.strokeWeight,
				 fillOpacity: 	this.circles[i].fillOpacity   || this.circles_conf.fillOpacity,
				 fillColor: 		this.circles[i].fillColor     || this.circles_conf.fillColor,
				 radius: 				this.circles[i].radius,
				 clickable:     false
			 	});
				this.circle_objects.push(circle);
				circle.setMap(this.map);
			}
		}
	},
	
	//polygons is an array of arrays. It loops.
	create_polygons: function(){
		for (var i = 0; i < this.polygons.length; ++i) {
			//Polygons could be customized. By convention, customization options should be contained in the first
	  	if (i==0)
			{
				//Array contain polygon elements
				if (this.polygons[i] instanceof Array) {
					this.create_polygon(i);
				}
				//hashes contain configuration which would be set as default
				else{
					if (this.exists(this.polygons[i].strokeColor)  ) { this.polygons_conf.strokeColor 	= this.polygons[i].strokeColor; 	}
					if (this.exists(this.polygons[i].strokeOpacity)) { this.polygons_conf.strokeOpacity = this.polygons[i].strokeOpacity; }
				  if (this.exists(this.polygons[i].strokeWeight )) { this.polygons_conf.strokeWeight 	= this.polygons[i].strokeWeight; 	}
				  if (this.exists(this.polygons[i].fillColor 		)) { this.polygons_conf.fillColor 		= this.polygons[i].fillColor; 		}
				  if (this.exists(this.polygons[i].fillOpacity 	)) { this.polygons_conf.fillOpacity 	= this.polygons[i].fillOpacity; 	}
				}
			}
			else { this.create_polygon(i); }
		}
	},
	
	//creates a single polygon, triggered by create_polygons
	create_polygon: function(i){
		var polygon_coordinates = [];
		var strokeColor;   
		var strokeOpacity; 
		var strokeWeight;  
		var fillColor;  
		var fillOpacity;
		//Polygon points are in an Array, that's why looping is necessary
		for (var j = 0; j < this.polygons[i].length; ++j) {
			var latlng = new google.maps.LatLng(this.polygons[i][j].latitude, this.polygons[i][j].longitude);
	  	polygon_coordinates.push(latlng);
			this.extend_bounds(latlng);
			//first element of an Array could contain specific configuration for this particular polygon. If no config given, use default
			if (j==0) {
				strokeColor   = this.polygons[i][j].strokeColor  	|| this.polygons_conf.strokeColor;
			  strokeOpacity = this.polygons[i][j].strokeOpacity || this.polygons_conf.strokeOpacity;
			  strokeWeight  = this.polygons[i][j].strokeWeight 	|| this.polygons_conf.strokeWeight;
			  fillColor     = this.polygons[i][j].fillColor 		|| this.polygons_conf.fillColor;
			  fillOpacity   = this.polygons[i][j].fillOpacity 	|| this.polygons_conf.fillOpacity;
			}
		}
	
		 // Construct the polygon
		var new_poly = new google.maps.Polygon({
		   paths: 				polygon_coordinates,
		   strokeColor: 	strokeColor,
		   strokeOpacity: strokeOpacity,
		   strokeWeight: 	strokeWeight,
		   fillColor: 		fillColor,
		   fillOpacity:   fillOpacity,
			 clickable:     false
		 });
		//save polygon in list
		this.polygon_objects.push(new_poly);
		new_poly.setMap(this.map);
	},
	
	//polylines is an array of arrays. It loops.
	create_polylines: function(){
		for (var i = 0; i < this.polylines.length; ++i) {
			//Polylines could be customized. By convention, customization options should be contained in the first
	  	if (i==0)
			{
				//Array contain polyline elements
				if (this.polylines[i] instanceof Array) {
					this.create_polyline(i);
				}
				//hashes contain configuration which would be set as default
				else{
					if (this.exists(this.polylines[i].strokeColor)   ) { this.polylines_conf.line_strokeColor 	 = this.polygons[i].strokeColor; 	}
					if (this.exists(this.polylines[i].strokeOpacity) ) { this.polylines_conf.line_strokeOpacity = this.polygons[i].strokeOpacity;}
				  if (this.exists(this.polylines[i].strokeWeight)  ) { this.polylines_conf.line_strokeWeight  = this.polygons[i].strokeWeight; }
				}
			}
			else { this.create_polyline(i); }
		}
	},
	
	//creates a single polyline, triggered by create_polylines
	create_polyline: function(i){
		var polyline_coordinates = [];
		var strokeColor;
	  var strokeOpacity;
	  var strokeWeight;
	
		//2 cases here, either we have a coded array of LatLng or we have an Array of LatLng
		for (var j = 0; j < this.polylines[i].length; ++j) {
			//if we have a coded array
			if (this.exists(this.polylines[i][j].coded_array)){
				var decoded_array = new google.maps.geometry.encoding.decodePath(this.polylines[i][j].coded_array);
				//loop through every point in the array
				for (var k = 0; k < decoded_array.length; ++k) {		
					polyline_coordinates.push(decoded_array[k]);
					this.extend_bounds(decoded_array[k]);
					polyline_coordinates.push(decoded_array[k]);				
				}
			}
			//or we have an array of latlng
			else{
				//by convention, a single polyline could be customized in the first array or it uses default values
				if (j==0){
					strokeColor   = this.polylines[i][0].strokeColor   || this.polylines_conf.strokeColor;
				  strokeOpacity = this.polylines[i][0].strokeOpacity || this.polylines_conf.strokeOpacity;
			  	strokeWeight  = this.polylines[i][0].strokeWeight  || this.polylines_conf.strokeWeight;
				}
				//add latlng if positions provided
				if (this.exists(this.polylines[i][j].latitude) && this.exists(this.polylines[i][j].longitude)) 
				{	
					var latlng = new google.maps.LatLng(this.polylines[i][j].latitude, this.polylines[i][j].longitude);
			  	polyline_coordinates.push(latlng);
					this.extend_bounds(latlng);
				}
			}
		}
		// Construct the polyline		
		var new_poly = new google.maps.Polyline({
		   path:  				polyline_coordinates,
		   strokeColor: 	strokeColor,
		   strokeOpacity: strokeOpacity,
		   strokeWeight: 	strokeWeight,
			 clickable:     false
		 });
		//save polyline
		this.polyline_objects.push(new_poly);
		new_poly.setMap(this.map);
	},
	
	//Two options:
	// 1- processing == "rails_model"  && builder = model_name
	// 2- processing == "json"    && builder = json in format: [{"description": , "longitude": , "title":, "latitude":, "picture": "", "width": "", "length": ""}]
	create_markers: function() {
		this.setup_Markers();
		this.adjust();
	},

  // clear markers
  clear_markers: function(){
    if (this.marker_objects.size() > 0) {
      for (i in this.marker_objects) {
        this.marker_objects[i].setMap(null);
      }
      this.marker_objects = new Array;
    }
  },

  // replace old markers with new markers on an existing map
  replace_markers: function(new_markers){
	  this.clear_markers();
		this.markers = [];
		//variable used for Auto-adjust
		this.bounds = new google.maps.LatLngBounds(); 
		this.add_markers(new_markers);
  },

	//add new markers to on an existing map (beware, it doesn't check duplicates)
  add_markers: function(new_markers){
    this.markers = this.markers.concat(new_markers);
    this.setup_Markers();
		this.adjust();
  },
	
  //Creates Marker from the markers passed + markerClusterer
  setup_Markers: function () {		    
		//resets Clusterer if needed
		if (this.markerClusterer) {
			this.markerClusterer.clearMarkers();
		}
	  // Add markers to the map
	  for (var i = 0; i < this.markers.length; ++i) {
			   //test if value passed or use default 
			   var marker_picture = this.exists(this.markers[i].picture) ? this.markers[i].picture : this.markers_conf.picture;
			   var marker_width 	= this.exists(this.markers[i].width)   ? this.markers[i].width 	 : this.markers_conf.width;
			   var marker_height 	= this.exists(this.markers[i].height)  ? this.markers[i].height  : this.markers_conf.length;
			   var marker_title 	= this.exists(this.markers[i].title)   ? this.markers[i].title 	 : null;
      	 var Lat = this.markers[i].latitude;
				 var Lng = this.markers[i].longitude;
				 
				 //alter coordinates if randomize is true
				 if ( this.markers_conf.randomize)
				 {
					var LatLng = this.randomize(Lat, Lng);
				  //retrieve coordinates from the array
				  Lat = LatLng[0]; Lng = LatLng[1];
				 }
				
				 var myLatLng = new google.maps.LatLng(Lat, Lng); 
				 this.extend_bounds(myLatLng);
				
				 // Marker sizes are expressed as a Size of X,Y
		 		 if (marker_picture == "")
					{ var ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, title: marker_title});	}
					else 
				  {
						var image = new google.maps.MarkerImage(marker_picture, new google.maps.Size(marker_width, marker_height) );
						var ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, icon: image, title: marker_title});
					}
					//save object for later use, basically, to get back the text to display when clicking it
					this.markers[i].marker_object = ThisMarker; 
					//add infowindowstuff + list creation if enabled
					this.handle_info_window(this.markers[i]);
					//save the marker in a list
					this.marker_objects.push(ThisMarker);
		}
		this.setup_Clusterer();
	},
	
	handle_info_window: function(marker_container){
		//create the infowindow
		var info_window = new google.maps.InfoWindow({content: marker_container.description });
		//add the listener associated
		google.maps.event.addListener(marker_container.marker_object, 'click', this.openInfoWindow(info_window, marker_container.marker_object));
		if (this.markers_conf.list_container)
		{
			var ul = document.getElementById(this.markers_conf.list_container);
			var li = document.createElement('li');
	    var aSel = document.createElement('a');
	    aSel.href = 'javascript:void(0);';
	    var html = this.exists(marker_container.sidebar) ? marker_container.sidebar : "Marker";
	    aSel.innerHTML = html;
	    aSel.onclick = this.generateTriggerCallback(marker_container.marker_object, 'click');
	    li.appendChild(aSel);
	    ul.appendChild(li);
		}
	},
	
	openInfoWindow: function(infoWindow, marker) {
    return function() {
      // Close the latest selected marker before opening the current one.
      if (Gmaps4Rails.visibleInfoWindow) {
        Gmaps4Rails.visibleInfoWindow.close();
      }
   
      infoWindow.open(Gmaps4Rails.map, marker);
      Gmaps4Rails.visibleInfoWindow = infoWindow;
    };
  },

  generateTriggerCallback: function(marker, eventType) {
    return function() {
			Gmaps4Rails.map.panTo(marker.position);
      google.maps.event.trigger(marker, eventType);
    };
  },
	
	setup_Clusterer: function()
	{
		if (this.markers_conf.do_clustering == true)
		{
			this.markerClusterer = new MarkerClusterer(this.map, this.marker_objects, {	maxZoom: this.markers_conf.clusterer_maxZoom,
																																			   gridSize: this.markers_conf.clusterer_gridSize,
																																			   //styles: styles TODO: offer clusterer customization
																																	  	   });
	  }
	},

	//to make the map fit the different LatLng points
	extend_bounds: function(latlng) {
		 //extending bounds, ref: http://unicornless.com/code/google-maps-v3-auto-zoom-and-auto-center
		 if (this.map_options.auto_adjust) {
		    this.bounds.extend(latlng);
		 }
	},

	//basic function to check existence of a variable
	exists: function(var_name) {
		return var_name	!= "" && typeof var_name !== "undefined"
	},

	//randomize
	randomize: function(Lat0, Lng0) {
		//distance in meters between 0 and max_random_distance (positive or negative)
		var dx = this.markers_conf.max_random_distance * this.random();
		var dy = this.markers_conf.max_random_distance * this.random();
		var Lat = parseFloat(Lat0) + (180/Math.PI)*(dy/6378137);
		var Lng = parseFloat(Lng0) + ( 90/Math.PI)*(dx/6378137)/Math.cos(Lat0);
		return [Lat, Lng];
	},
	
	//adjust or not center of the map. Takes into account auto_adjust & auto_adjust
	adjust: function(){
		if (this.map_options.auto_adjust) {
			if(this.map_options.auto_zoom) {
				this.map.fitBounds(this.bounds); 
				}
			else {
				var map_center = this.bounds.getCenter();
				this.map_options.center_longitude = map_center.Da;
				this.map_options.center_latitude  = map_center.Ba;
				this.map.setCenter(map_center);
			}
		}
	},
	
	//retrives a value between -1 and 1
	random: function() { return ( Math.random() * 2 -1); }
	
};

//marker_clusterer styles
// var styles = [{
//   url: 'http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/1.0/images/people35.png',
//   height: 35,
//   width: 35,
//   opt_anchor: [16, 0],
//   opt_textColor: '#ff00ff',
//   opt_textSize: 10
// }];
