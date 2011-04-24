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
		auto_adjust : false,    //adjust the map to the markers if set to true
		auto_zoom: true,        //zoom given by auto-adjust
		bounds: []              //adjust map to these limits. Should be [{"lat": , "lng": }]
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
	markers : [],							  //contains all markers. A marker contains the following: {"description": , "longitude": , "title":, "latitude":, "picture": "", "width": "", "length": "", "sidebar": "", "google_object": google_marker}
	bounds_object: null,				//contains current bounds from markers, polylines etc...
	polygons: [], 						  //contains raw data, array of arrays (first element could be a hash containing options)
	polylines: [], 						  //contains raw data, array of arrays (first element could be a hash containing options)
	circles: [],                //contains raw data, array of hash
  markerClusterer: null,			//contains all marker clusterers
  
	//Polygon Styling
	polygons_conf: {						//default style for polygons
		strokeColor: "#FFAA00",
  	strokeOpacity: 0.8,
  	strokeWeight: 2,
    fillColor: "#000000",
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
	  fillColor: "#00AAFF",
	  fillOpacity: 0.35,
		strokeColor: "#FFAA00",
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
		//resets sidebar if needed
		this.reset_sidebar_content();
		//launch callbacks if any
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
			if ( i === 0 )
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
				this.circles[i].google_object = circle;
				circle.setMap(this.map);
			}
		}
	},
	
	//polygons is an array of arrays. It loops.
	create_polygons: function(){
		for (var i = 0; i < this.polygons.length; ++i) {
			this.create_polygon(i);
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
			//first element of an Array could contain specific configuration for this particular polygon. If no config given, use default
			if (j===0) {
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
		this.polygons[i].google_object = new_poly;
		new_poly.setMap(this.map);
	},
	
	//polylines is an array of arrays. It loops.
	create_polylines: function(){
		for (var i = 0; i < this.polylines.length; ++i) {
		  this.create_polyline(i);
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
					polyline_coordinates.push(decoded_array[k]);				
				}
			}
			//or we have an array of latlng
			else{
				//by convention, a single polyline could be customized in the first array or it uses default values
				if (j===0){
					strokeColor   = this.polylines[i][0].strokeColor   || this.polylines_conf.strokeColor;
				  strokeOpacity = this.polylines[i][0].strokeOpacity || this.polylines_conf.strokeOpacity;
			  	strokeWeight  = this.polylines[i][0].strokeWeight  || this.polylines_conf.strokeWeight;
				}
				//add latlng if positions provided
				if (this.exists(this.polylines[i][j].latitude) && this.exists(this.polylines[i][j].longitude)) 
				{	
					var latlng = new google.maps.LatLng(this.polylines[i][j].latitude, this.polylines[i][j].longitude);
			  	polyline_coordinates.push(latlng);
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
		this.polylines[i].google_object = new_poly;
		new_poly.setMap(this.map);
	},

	//creates, clusterizes and adjusts map 
	create_markers: function() {
		this.create_google_markers_from_markers();
		this.clusterize();
		this.adjust_map_to_bounds();
	},
	
	//create google.maps Markers from data provided by user
	create_google_markers_from_markers: function(){
		for (var i = 0; i < this.markers.length; ++i) {
		  //check if the marker has not already been created
			if (!this.exists(this.markers[i].google_object)) {
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
				 var ThisMarker;
				 // Marker sizes are expressed as a Size of X,Y
		 		 if (marker_picture === "")
					{ ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, title: marker_title});	}
					else 
				  {
						var image = new google.maps.MarkerImage(marker_picture, new google.maps.Size(marker_width, marker_height) );
					  ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, icon: image, title: marker_title});
					}
					//save object
					this.markers[i].google_object = ThisMarker; 
					//add infowindowstuff if enabled
					this.create_info_window(this.markers[i]);
					//create sidebar if enabled
					this.create_sidebar(this.markers[i]);
			 }
		}
		
	},

  // clear markers
  clear_markers: function(){
    if (this.markerClusterer !== null){
			this.markerClusterer.clearMarkers();
		}
		for (var i = 0; i <  this.markers.length; ++i) {
      this.markers[i].google_object.setMap(null);
    }
  },

  // replace old markers with new markers on an existing map
  replace_markers: function(new_markers){
	  //reset previous markers
		this.markers = new Array;
		//reset current bounds
		this.google_bounds = new google.maps.LatLngBounds();
		//reset sidebar content if exists
		this.reset_sidebar_content();
		//add new markers
		this.add_markers(new_markers);
  },

	//add new markers to on an existing map
  add_markers: function(new_markers){
	  //clear the whole map
	  this.clear_markers();
	  //update the list of markers to take into account
    this.markers = this.markers.concat(new_markers);
    //put markers on the map
    this.create_markers();
  },
	
	//creates clusters
	clusterize: function()
	{
		if (this.markers_conf.do_clustering === true)
		{
			var gmarkers_array = new Array;
			for (var i = 0; i <  this.markers.length; ++i) {
       gmarkers_array.push(this.markers[i].google_object);
      }
			
			
			this.markerClusterer = new MarkerClusterer(this.map, gmarkers_array, {	maxZoom: this.markers_conf.clusterer_maxZoom, gridSize: this.markers_conf.clusterer_gridSize });
	  }
	},
	
	// creates infowindows
	create_info_window: function(marker_container){
		//create the infowindow
		var info_window = new google.maps.InfoWindow({content: marker_container.description });
		//add the listener associated
		google.maps.event.addListener(marker_container.google_object, 'click', this.openInfoWindow(info_window, marker_container.google_object));

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

	//creates sidebar
	create_sidebar: function(marker_container){
		if (this.markers_conf.list_container)
		{
			var ul = document.getElementById(this.markers_conf.list_container);
			var li = document.createElement('li');
	    var aSel = document.createElement('a');
	    aSel.href = 'javascript:void(0);';
	    var html = this.exists(marker_container.sidebar) ? marker_container.sidebar : "Marker";
	    aSel.innerHTML = html;
	    aSel.onclick = this.sidebar_element_handler(marker_container.google_object, 'click');
	    li.appendChild(aSel);
	    ul.appendChild(li);
		}
	},

	//moves map to marker clicked + open infowindow
  sidebar_element_handler: function(marker, eventType) {
    return function() {
			Gmaps4Rails.map.panTo(marker.position);
      google.maps.event.trigger(marker, eventType);
    };
  },	

	reset_sidebar_content: function(){
		if (this.markers_conf.list_container !== null ){
			var ul = document.getElementById(this.markers_conf.list_container);
			ul.innerHTML = "";
		}
	},

	//to make the map fit the different LatLng points
	adjust_map_to_bounds: function(latlng) {
		
		//FIRST_STEP: retrieve all bounds
		//create the bounds object only if necessary
		if (this.map_options.auto_adjust || this.map_options.bounds !== null) {
			this.google_bounds = new google.maps.LatLngBounds();
		}
		
		//if autodjust is true, must get bounds from markers polylines etc...
		if (this.map_options.auto_adjust) {
			//from markers
			for (var i = 0; i <  this.markers.length; ++i) {
	     	this.google_bounds.extend(this.markers[i].google_object.position);
	    }
 		  //from polygons:
			for (var i = 0; i <  this.polylines.length; ++i) {
				this.polylines[i].google_object.latLngs.forEach(function(obj1){ obj1.forEach(function(obj2){ Gmaps4Rails.google_bounds.extend(obj2);} );})
			}
			//from polylines:
			for (var i = 0; i <  this.polygons.length; ++i) {
				this.polygons[i].google_object.latLngs.forEach(function(obj1){ obj1.forEach(function(obj2){ Gmaps4Rails.google_bounds.extend(obj2);} );})
			}
			//from circles
			for (var i = 0; i <  this.circles.length; ++i) {
				this.google_bounds.extend(this.circles[i].google_object.getBounds().getNorthEast());
				this.google_bounds.extend(this.circles[i].google_object.getBounds().getSouthWest());
			}		
		}
		//in every case, I've to take into account the bounds set up by the user	
		for (var i = 0; i < this.map_options.bounds.length; ++i) {
			//create points from bounds provided
			var bound = new google.maps.LatLng(this.map_options.bounds[i].lat, this.map_options.bounds[i].lng);
			this.google_bounds.extend(bound);
		}
		
		//SECOND_STEP: ajust the map to the bounds
		if (this.map_options.auto_adjust || this.map_options.bounds.length > 0) {
	
			//if autozoom is false, take user info into account
			if(!this.map_options.auto_zoom) {
				var map_center = this.google_bounds.getCenter();
				this.map_options.center_longitude = map_center.lat();
				this.map_options.center_latitude  = map_center.lng();
				this.map.setCenter(map_center);
			}
			else {
			  this.map.fitBounds(this.google_bounds); 
			}
		}
	},

	//basic function to check existence of a variable
	exists: function(var_name) {
		return var_name	!== "" && typeof var_name !== "undefined"
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
	
	//gives a value between -1 and 1
	random: function() { return ( Math.random() * 2 -1); }
	
};