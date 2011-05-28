var Gmaps4Rails = {
	//map config
	map: null,									// contains the map we're working on
	visibleInfoWindow: null,    //contains the current opened infowindow
  userLocation: null,         //contains user's location if geolocalization was performed and successful

	//Map settings
	map_options: {
	  id: 'gmaps4rails_map',
		disableDefaultUI: false,
		disableDoubleClickZoom: false,
		draggable: true,
	  type: "ROADMAP",         // HYBRID, ROADMAP, SATELLITE, TERRAIN
		detect_location: false,  // should the browser attempt to use geolocation detection features of HTML5?
	  center_on_user: false,   // centers map on the location detected through the browser
		center_latitude: 0,
		center_longitude: 0, 
		zoom: 1,
		maxZoom: null,
		minZoom: null,
		auto_adjust : false,    // adjust the map to the markers if set to true
		auto_zoom: true,        // zoom given by auto-adjust
		bounds: []              // adjust map to these limits. Should be [{"lat": , "lng": }]
	},				
	
	//markers + info styling
	markers_conf: {
		// Marker config
		title: "",
		// MarkerImage config
	  picture : "",
		width: 22,
		length: 32,
    draggable: false,         // how to modify: <%= gmaps( "markers" => { "data" => @object.to_gmaps4rails, "options" => { "draggable" => true }}) %>
		anchor: null,             // centeranchor position of the marker image. Default is null <=> center, you can set options: top_left, top_center, top_right, center_left, center, center_right, bottom_right, bottom_center, bottom_left
		//clustering config
	  do_clustering: true,			// do clustering if set to true
	  clusterer_gridSize: 50,		// the more the quicker but the less precise
		clusterer_maxZoom:  5,		// removes clusterer  at this zoom level
		randomize: false,         // Google maps can't display two markers which have the same coordinates. This randomizer enables to prevent this situation from happening.
		max_random_distance: 100, // in meters. Each marker coordinate could be altered by this distance in a random direction
		list_container: null,     // id of the ul that will host links to all markers
		custom_cluster_pictures: null,
		custom_infowindow_class: null,
	},
	
	//Stored variables
	markers: [],							  // contains all markers. A marker contains the following: {"description": , "longitude": , "title":, "latitude":, "picture": "", "width": "", "length": "", "sidebar": "", "google_object": google_marker}
	bounds_object: null,				// contains current bounds from markers, polylines etc...
	polygons: [], 						  // contains raw data, array of arrays (first element could be a hash containing options)
	polylines: [], 						  // contains raw data, array of arrays (first element could be a hash containing options)
	circles: [],                // contains raw data, array of hash
  markerClusterer: null,			// contains all marker clusterers
  
	//Polygon Styling
	polygons_conf: {						// default style for polygons
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
	  strokeWeight: 2,
		clickable: false,
		zIndex: null
	},
	
	//Direction Settings
	direction_conf: {
		panel_id: 					null,
		display_panel: 			false,
		origin: 						null, 
    destination: 				null,
		waypoints: 					[],       //[{location: "toulouse,fr", stopover: true}, {location: "Clermont-Ferrand, fr", stopover: true}]
    optimizeWaypoints: 	false,
		unitSystem: 				"METRIC", //IMPERIAL
		avoidHighways: 			false,
		avoidTolls: 				false,
		region: 						null, 
		travelMode: 				"DRIVING" //WALKING, BICYCLING
	},
	
	//initializes the map
	initialize: function() {
		
		this.map = new google.maps.Map(document.getElementById(this.map_options.id), {
			  maxZoom: this.map_options.maxZoom,
			  minZoom: this.map_options.minZoom,
				zoom: this.map_options.zoom,
		 		center: new google.maps.LatLng(this.map_options.center_latitude, this.map_options.center_longitude),
				mapTypeId: google.maps.MapTypeId[this.map_options.type],
				mapTypeControl: this.map_options.mapTypeControl,
				disableDefaultUI: this.map_options.disableDefaultUI,
				disableDoubleClickZoom: this.map_options.disableDoubleClickZoom,
				draggable: this.map_options.draggable
		});
		
		if (this.map_options.detect_location === true || this.map_options.center_on_user === true) { 
			this.findUserLocation();
		}    
		//resets sidebar if needed
		this.reset_sidebar_content();
	},
	
	findUserLocation: function() {
		if(navigator.geolocation) {
			//try to retrieve user's position
	    navigator.geolocation.getCurrentPosition(function(position) {
				//saves the position in the userLocation variable
	      Gmaps4Rails.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    	//change map's center to focus on user's geoloc if asked
				if(Gmaps4Rails.map_options.center_on_user === true) {
					Gmaps4Rails.map.setCenter(Gmaps4Rails.userLocation);
				}
	    },
	    function() {
		    //if failure, triggers the function if defined
			  if(this.fnSet("gmaps4rails_geolocation_failure")) { gmaps4rails_geolocation_failure(true); }
			});
	  }
	  else {
		  //if failure, triggers the function if defined
		  if(this.fnSet("gmaps4rails_geolocation_failure")) { gmaps4rails_geolocation_failure(false); }
	  }
	},

	////////////////////////////////////////////////////
	//////////////////// DIRECTIONS ////////////////////
	////////////////////////////////////////////////////
	
	create_direction: function(){
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();

		directionsDisplay.setMap(this.map);
		//display panel only if required
		if (this.direction_conf.display_panel) {	directionsDisplay.setPanel(document.getElementById(this.direction_conf.panel_id)); }
		directionsDisplay.setOptions({
			suppressMarkers:     false,
			suppressInfoWindows: false,
			suppressPolylines:   false
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
					language: 					"en"
	    };
	   directionsService.route(request, function(response, status) {
	      if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
	      }
	    });
	},
	
	////////////////////////////////////////////////////
	///////////////////// CIRCLES //////////////////////
	////////////////////////////////////////////////////
	
	//Loops through all circles
	//Loops through all circles and draws them
	create_circles: function() {
		for (var i = 0; i < this.circles.length; ++i) {
			//by convention, default style configuration could be integrated in the first element
			this.create_circle(this.circles[i]);
		}
	},
	
	create_circle: function(circle) {
		if ( i === 0 ) {
			if (this.exists(circle.strokeColor  )) { this.circles_conf.strokeColor 	 = circle.strokeColor; 	 }
			if (this.exists(circle.strokeOpacity)) { this.circles_conf.strokeOpacity = circle.strokeOpacity; }
		  if (this.exists(circle.strokeWeight )) { this.circles_conf.strokeWeight  = circle.strokeWeight;  }
		  if (this.exists(circle.fillColor    )) { this.circles_conf.fillColor 		 = circle.fillColor; 		 }
		  if (this.exists(circle.fillOpacity  )) { this.circles_conf.fillOpacity 	 = circle.fillOpacity; 	 }
		}
		if (this.exists(circle.latitude) && this.exists(circle.longitude)) {
			// always check if a config is given, if not, use defaults
			// NOTE: is there a cleaner way to do this? Maybe a hash merge of some sort?
			var newCircle = new google.maps.Circle({
			   center:        new google.maps.LatLng(circle.latitude, circle.longitude),
			   strokeColor:   circle.strokeColor   || this.circles_conf.strokeColor,
			   strokeOpacity: circle.strokeOpacity || this.circles_conf.strokeOpacity,
			   strokeWeight: 	circle.strokeWeight  || this.circles_conf.strokeWeight,
				 fillOpacity: 	circle.fillOpacity   || this.circles_conf.fillOpacity,
				 fillColor: 		circle.fillColor     || this.circles_conf.fillColor,
				 clickable:     circle.clickable     || this.circles_conf.clickable,
				 zIndex: 				circle.zIndex				 || this.circles_conf.zIndex,
				 radius: 				circle.radius
		 	});
			circle.google_object = newCircle;
			newCircle.setMap(this.map);
		}
	},
	
	// clear circles
  clear_circles: function() {
		for (var i = 0; i <  this.circles.length; ++i) {
			this.clear_circle(this.circles[i]);
    }
  },

	clear_circle: function(circle) {
		circle.google_object.setMap(null);
	},
	
	hide_circles: function() {
		for (var i = 0; i <  this.circles.length; ++i) {
			this.hide_circle(this.circles[i]);
    }
	},
	
	hide_circle: function(circle) {
		circle.google_object.setMap(null);
	},
	
	show_circles: function() {
		for (var i = 0; i <  this.circles.length; ++i) {
			this.show_circle(this.circles[i]);
    }
	},
	
	show_circle: function(circle) {
		circle.google_object.setMap(this.map);
	},

	////////////////////////////////////////////////////
	///////////////////// POLYGONS /////////////////////
	////////////////////////////////////////////////////
	
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

	////////////////////////////////////////////////////
	/////////////////// POLYLINES //////////////////////
	////////////////////////////////////////////////////
	
	//polylines is an array of arrays. It loops.
	create_polylines: function(){
		for (var i = 0; i < this.polylines.length; ++i) {
		  this.create_polyline(i);
		}
	},
	
	//creates a single polyline, triggered by create_polylines
	create_polyline: function(i) {
		var polyline_coordinates = [];
		var strokeColor;
	  var strokeOpacity;
	  var strokeWeight;
	
		//2 cases here, either we have a coded array of LatLng or we have an Array of LatLng
		for (var j = 0; j < this.polylines[i].length; ++j) {
			//if we have a coded array
			if (this.exists(this.polylines[i][j].coded_array)) {
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
				if (j===0) {
					strokeColor   = this.polylines[i][0].strokeColor   || this.polylines_conf.strokeColor;
				  strokeOpacity = this.polylines[i][0].strokeOpacity || this.polylines_conf.strokeOpacity;
			  	strokeWeight  = this.polylines[i][0].strokeWeight  || this.polylines_conf.strokeWeight;
				}
				//add latlng if positions provided
				if (this.exists(this.polylines[i][j].latitude) && this.exists(this.polylines[i][j].longitude)) {	
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

	////////////////////////////////////////////////////
	///////////////////// MARKERS //////////////////////
	////////////////////////////////////////////////////

	//creates, clusterizes and adjusts map 
	create_markers: function() {
		this.create_google_markers_from_markers();
		this.clusterize();
		this.adjust_map_to_bounds();
	},
	
	//create google.maps Markers from data provided by user
	create_google_markers_from_markers: function() {
		for (var i = 0; i < this.markers.length; ++i) {
		  //check if the marker has not already been created
			if (!this.exists(this.markers[i].google_object)) {
			   //test if value passed or use default 
			   var marker_picture = this.exists(this.markers[i].picture) ? this.markers[i].picture : this.markers_conf.picture;
			   var marker_width 	= this.exists(this.markers[i].width)   ? this.markers[i].width 	 : this.markers_conf.width;
			   var marker_height 	= this.exists(this.markers[i].height)  ? this.markers[i].height  : this.markers_conf.length;
				 var marker_anchor	= this.exists(this.markers[i].anchor)	 ? this.markers[i].anchor  : this.markers_conf.anchor;
			   var marker_title 	= this.exists(this.markers[i].title)   ? this.markers[i].title 	 : null;
			   var marker_draggable 	= this.exists(this.markers[i].draggable)   ? this.markers[i].draggable 	 : this.markers_conf.draggable;
      	 var Lat = this.markers[i].latitude;
				 var Lng = this.markers[i].longitude;
				 var imageAnchorPosition = null;
				 // calculate MarkerImage anchor location
				 if (this.exists(this.markers[i].width) && this.exists(this.markers[i].height) && marker_anchor !== null) {
				 		imageAnchorPosition = this.getImageAnchorPosition(marker_width, marker_height, marker_anchor);
				 }
				
				 //alter coordinates if randomize is true
				 if ( this.markers_conf.randomize) {
						var LatLng = this.randomize(Lat, Lng);
				  	//retrieve coordinates from the array
				  	Lat = LatLng[0]; Lng = LatLng[1];
				 }
				
				 var markerLatLng = new google.maps.LatLng(Lat, Lng); 
				 var thisMarker;
				 // Marker sizes are expressed as a Size of X,Y
		 		 if (marker_picture === "") { 
						thisMarker = new google.maps.Marker({position: markerLatLng, map: this.map, title: marker_title, draggable: marker_draggable});
				 } else {
						var image = new google.maps.MarkerImage(marker_picture, new google.maps.Size(marker_width, marker_height), null, imageAnchorPosition, null );
					  thisMarker = new google.maps.Marker({position: markerLatLng, map: this.map, icon: image, title: marker_title, draggable: marker_draggable});
				 }
				 //save object
				 this.markers[i].google_object = thisMarker; 
				 //add infowindowstuff if enabled
				 this.create_info_window(this.markers[i]);
				 //create sidebar if enabled
				 this.create_sidebar(this.markers[i]);
			 }
		  }
		},
		
		// calculate anchor point for MarkerImage	
	getImageAnchorPosition: function(markerWidth, markerHeight, anchorLocation) {
			var x;
			var y;
			switch (anchorLocation) {
				case "top_left":
					x = 0;
					y = 0;
					break;
				case "top_center":
					x = markerWidth / 2;
					y = 0;
					break;		
				case "top_right":
					x = markerWidth;
					y = 0;
					break;		
				case "center_left":
					x = 0;
					y = markerHeight / 2;
					break;		
				case "center":
					x = markerWidth / 2;
					y = markerHeight / 2;
					break;
				case "center_right":
					x = markerWidth;
					y = markerHeight / 2;
					break;		
				case "bottom_left":
					x = 0;
					y = markerHeight;
					break;		
				case "bottom_center":
					x = markerWidth / 2;
					y = markerHeight;
					break;		
				case "bottom_right":
					x = markerWidth;
					y = markerHeight;
					break;		
			}
		return new google.maps.Point(x,y);
	},

  // clear markers
  clear_markers: function() {
    if (this.markerClusterer !== null){
			this.markerClusterer.clearMarkers();
		}
		for (var i = 0; i < this.markers.length; ++i) {
      this.clear_marker(this.markers[i]);
    }
  },

	clear_marker: function(marker) {
		marker.google_object.setMap(null);
	},

	// show and hide markers
	show_markers: function() {
		for (var i = 0; i < this.markers.length; ++i) {
      this.show_marker(this.markers[i]);
    }
	},
	
	show_marker: function(marker) {
		marker.google_object.setVisible(true);
	},
	
	hide_markers: function() {
		for (var i = 0; i < this.markers.length; ++i) {
      this.hide_marker(this.markers[i]);
    }
	},
	
	hide_marker: function(marker) {
		marker.google_object.setVisible(false);
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
			var clustererStyle = null;
			if(this.fnSet("gmaps_custom_clusterer_pic")) {
				clustererStyle = gmaps_custom_clusterer_pic();
			}
			this.markerClusterer = new MarkerClusterer( this.map,
																									gmarkers_array, 
																									{	maxZoom: this.markers_conf.clusterer_maxZoom, gridSize: this.markers_conf.clusterer_gridSize, styles: clustererStyle }
																								);
	  }
	},

	////////////////////////////////////////////////////
	/////////////////// INFO WINDOW ////////////////////
	////////////////////////////////////////////////////

	// creates infowindows
	create_info_window: function(marker_container){
		var info_window;
		if (this.markers_conf.custom_infowindow_class === null) {
		//create the infowindow
		info_window = new google.maps.InfoWindow({content: marker_container.description });
		//add the listener associated
		google.maps.event.addListener(marker_container.google_object, 'click', this.openInfoWindow(info_window, marker_container.google_object));
		}
		else { //creating custom infowindow
			if (this.exists(marker_container.description)) {
				var boxText = document.createElement("div");
				boxText.setAttribute("class", this.markers_conf.custom_infowindow_class); //to customize
				boxText.innerHTML = marker_container.description;	
				info_window = new InfoBox(gmaps4rails_infobox(boxText));
				google.maps.event.addListener(marker_container.google_object, 'click', this.openInfoWindow(info_window, marker_container.google_object));
			}
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

	////////////////////////////////////////////////////
	///////////////////// SIDEBAR //////////////////////
	////////////////////////////////////////////////////

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

	////////////////////////////////////////////////////
	////////////////// MISCELLANEOUS ///////////////////
	////////////////////////////////////////////////////

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
				this.polylines[i].google_object.latLngs.forEach(function(obj1){ obj1.forEach(function(obj2){ Gmaps4Rails.google_bounds.extend(obj2);} );});
			}
			//from polylines:
			for (var i = 0; i <  this.polygons.length; ++i) {
				this.polygons[i].google_object.latLngs.forEach(function(obj1){ obj1.forEach(function(obj2){ Gmaps4Rails.google_bounds.extend(obj2);} );});
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
		return (var_name	!== "" && typeof var_name !== "undefined");
	},
	//check existence of function
	fnSet: function(fn_name){
		return(typeof fn_name == 'function');
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