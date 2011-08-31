var Gmaps = {};

Gmaps.loadMaps = function(){
  //loop through all variable names.
  // there should only be maps inside so it trigger their load function
  for (var attrname in Gmaps) {
    if (attrname !== "loadMaps"){
      window["load_" + attrname]();
    }
  }
}

function Gmaps4Rails() {

  //map config
  this.map =  null;                  // contains the map we're working on
  this.visibleInfoWindow = null;    //contains the current opened infowindow
  this.userLocation = null;         //contains user's location if geolocalization was performed and successful

  //empty slots
  this.geolocationFailure = function() { return false;}  //triggered when geolocation fails. If customized, must be like= function(navigator_handles_geolocation){} where 'navigator_handles_geolocation' is a boolean
  this.callback =           function() { return false;}  //to let user set a custom callback function
  this.customClusterer =    function() { return null;}   //to let user set custom clusterer pictures
  this.infobox =            function() { return null;}   //to let user use custom infoboxes

  this.default_map_options = {
    id: 'map',
    draggable: true,
    detect_location: false,  // should the browser attempt to use geolocation detection features of HTML5?
    center_on_user: false,   // centers map on the location detected through the browser
    center_latitude: 0,
    center_longitude: 0, 
    zoom: 7,
    maxZoom: null,
    minZoom: null,
    auto_adjust : true,     // adjust the map to the markers if set to true
    auto_zoom: true,        // zoom given by auto-adjust
    bounds: []              // adjust map to these limits. Should be [{"lat": , "lng": }]    
  };
  
  this.default_markers_conf = {
    // Marker config
    title: "",
    // MarkerImage config
    picture : "",
    width: 22,
    length: 32,
    draggable: false,         // how to modify: <%= gmaps( "markers" => { "data" => @object.to_gmaps4rails, "options" => { "draggable" => true }}) %>
    //clustering config
    do_clustering: true,      // do clustering if set to true
    randomize: false,         // Google maps can't display two markers which have the same coordinates. This randomizer enables to prevent this situation from happening.
    max_random_distance: 100, // in meters. Each marker coordinate could be altered by this distance in a random direction
    list_container: null,     // id of the ul that will host links to all markers
    offset: 0                 //used when adding_markers to an existing map. Because new markers are concated with previous one, offset is here to prevent the existing from being re-created.
  };
  
  //Stored variables
  this.markers = [];            // contains all markers. A marker contains the following: {"description": , "longitude": , "title":, "latitude":, "picture": "", "width": "", "length": "", "sidebar": "", "serviceObject": google_marker}
  this.boundsObject = null;     // contains current bounds from markers, polylines etc...
  this.polygons = [];           // contains raw data, array of arrays (first element could be a hash containing options)
  this.polylines = [];          // contains raw data, array of arrays (first element could be a hash containing options)
  this.circles = [];            // contains raw data, array of hash
  this.markerClusterer = null;  // contains all marker clusterers
  this.markerImages = [];
  
  //initializes the map
  this.initialize = function() {

    this.map = this.createMap();

    if (this.map_options.detect_location === true || this.map_options.center_on_user === true) { 
      this.findUserLocation(this);
    }    
    //resets sidebar if needed
    this.resetSidebarContent();
  }

 // this.initialize();

  this.findUserLocation = function(map_object) {
    if(navigator.geolocation) {
      //try to retrieve user's position
      navigator.geolocation.getCurrentPosition(function(position) {
        //saves the position in the userLocation variable
        map_object.userLocation = map_object.createLatLng(position.coords.latitude, position.coords.longitude);
        //change map's center to focus on user's geoloc if asked
        if(map_object.map_options.center_on_user === true) {
          map_object.centerMapOnUser();
        }
      },
      function() {
        //failure, but the navigator handles geolocation
        map_object.geolocationFailure(true);
      });
    }
    else {
      //failure but the navigator doesn't handle geolocation
      map_object.geolocationFailure(false);
    }
  }

  ////////////////////////////////////////////////////
  //////////////////// DIRECTIONS ////////////////////
  ////////////////////////////////////////////////////

  this.create_direction = function(){
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
      origin:             this.direction_conf.origin, 
      destination:        this.direction_conf.destination,
      waypoints:          this.direction_conf.waypoints,
      optimizeWaypoints:  this.direction_conf.optimizeWaypoints,
      unitSystem:         google.maps.DirectionsUnitSystem[this.direction_conf.unitSystem],
      avoidHighways:      this.direction_conf.avoidHighways,
      avoidTolls:         this.direction_conf.avoidTolls,
      region:             this.direction_conf.region, 
      travelMode:         google.maps.DirectionsTravelMode[this.direction_conf.travelMode],
      language:           "en"
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  ////////////////////////////////////////////////////
  ///////////////////// CIRCLES //////////////////////
  ////////////////////////////////////////////////////

  //Loops through all circles
  //Loops through all circles and draws them
  this.create_circles = function() {
    for (var i = 0; i < this.circles.length; ++i) {
      //by convention, default style configuration could be integrated in the first element
      this.create_circle(this.circles[i]);
    }
  }

  this.create_circle = function(circle) {
    if ( i === 0 ) {
      if (this.exists(circle.strokeColor  )) { this.circles_conf.strokeColor   = circle.strokeColor; 	 }
      if (this.exists(circle.strokeOpacity)) { this.circles_conf.strokeOpacity = circle.strokeOpacity; }
      if (this.exists(circle.strokeWeight )) { this.circles_conf.strokeWeight  = circle.strokeWeight;  }
      if (this.exists(circle.fillColor    )) { this.circles_conf.fillColor     = circle.fillColor; 		 }
      if (this.exists(circle.fillOpacity  )) { this.circles_conf.fillOpacity   = circle.fillOpacity; 	 }
    }
    if (this.exists(circle.lat) && this.exists(circle.lng)) {
      // always check if a config is given, if not, use defaults
      // NOTE: is there a cleaner way to do this? Maybe a hash merge of some sort?
      var newCircle = new google.maps.Circle({
        center:        this.createLatLng(circle.lat, circle.lng),
        strokeColor:   circle.strokeColor   || this.circles_conf.strokeColor,
        strokeOpacity: circle.strokeOpacity || this.circles_conf.strokeOpacity,
        strokeWeight:  circle.strokeWeight  || this.circles_conf.strokeWeight,
        fillOpacity:   circle.fillOpacity   || this.circles_conf.fillOpacity,
        fillColor:     circle.fillColor     || this.circles_conf.fillColor,
        clickable:     circle.clickable     || this.circles_conf.clickable,
        zIndex:        circle.zIndex        || this.circles_conf.zIndex,
        radius:        circle.radius
      });
      circle.serviceObject = newCircle;
      newCircle.setMap(this.map);
    }
  }

  // clear circles
  this.clear_circles = function() {
    for (var i = 0; i <  this.circles.length; ++i) {
      this.clear_circle(this.circles[i]);
    }
  }

  this.clear_circle = function(circle) {
    circle.serviceObject.setMap(null);
  }

  this.hide_circles = function() {
    for (var i = 0; i <  this.circles.length; ++i) {
      this.hide_circle(this.circles[i]);
    }
  }

  this.hide_circle = function(circle) {
    circle.serviceObject.setMap(null);
  }

  this.show_circles = function() {
    for (var i = 0; i <  this.circles.length; ++i) {
      this.show_circle(this.circles[i]);
    }
  }

  this.show_circle = function(circle) {
    circle.serviceObject.setMap(this.map);
  }

  ////////////////////////////////////////////////////
  ///////////////////// POLYGONS /////////////////////
  ////////////////////////////////////////////////////

  //polygons is an array of arrays. It loops.
  this.create_polygons = function(){
    for (var i = 0; i < this.polygons.length; ++i) {
      this.create_polygon(i);
    }
  }

  //creates a single polygon, triggered by create_polygons
  this.create_polygon = function(i){
    var polygon_coordinates = [];
    var strokeColor;   
    var strokeOpacity; 
    var strokeWeight;  
    var fillColor;  
    var fillOpacity;
    //Polygon points are in an Array, that's why looping is necessary
    for (var j = 0; j < this.polygons[i].length; ++j) {
      var latlng = this.createLatLng(this.polygons[i][j].lat, this.polygons[i][j].lng);
      polygon_coordinates.push(latlng);
      //first element of an Array could contain specific configuration for this particular polygon. If no config given, use default
      if (j===0) {
        strokeColor   = this.polygons[i][j].strokeColor   || this.polygons_conf.strokeColor;
        strokeOpacity = this.polygons[i][j].strokeOpacity || this.polygons_conf.strokeOpacity;
        strokeWeight  = this.polygons[i][j].strokeWeight  || this.polygons_conf.strokeWeight;
        fillColor     = this.polygons[i][j].fillColor     || this.polygons_conf.fillColor;
        fillOpacity   = this.polygons[i][j].fillOpacity   || this.polygons_conf.fillOpacity;
      }
    }

    // Construct the polygon
    var new_poly = new google.maps.Polygon({
      paths:          polygon_coordinates,
      strokeColor:    strokeColor,
      strokeOpacity:  strokeOpacity,
      strokeWeight:   strokeWeight,
      fillColor:      fillColor,
      fillOpacity:    fillOpacity,
      clickable:      false
    });
    //save polygon in list
    this.polygons[i].serviceObject = new_poly;
    new_poly.setMap(this.map);
  }

  ////////////////////////////////////////////////////
  /////////////////// POLYLINES //////////////////////
  ////////////////////////////////////////////////////

  //polylines is an array of arrays. It loops.
  this.create_polylines = function(){
    for (var i = 0; i < this.polylines.length; ++i) {
      this.create_polyline(i);
    }
  }

  //creates a single polyline, triggered by create_polylines
  this.create_polyline = function(i) {
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
        if (this.exists(this.polylines[i][j].lat) && this.exists(this.polylines[i][j].lng)) {	
          var latlng = this.createLatLng(this.polylines[i][j].lat, this.polylines[i][j].lng);
          polyline_coordinates.push(latlng);
        }
      }
    }
    // Construct the polyline		
    var new_poly = new google.maps.Polyline({
      path:         polyline_coordinates,
      strokeColor:  strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
      clickable:     false
    });
    //save polyline
    this.polylines[i].serviceObject = new_poly;
    new_poly.setMap(this.map);
  }

  ////////////////////////////////////////////////////
  ///////////////////// MARKERS //////////////////////
  //////////////////tests coded///////////////////////

  //creates, clusterizes and adjusts map 
  this.create_markers = function() {
    this.createServiceMarkersFromMarkers();
    this.clusterize();
    this.adjustMapToBounds();
  }

  //create google.maps Markers from data provided by user
  this.createServiceMarkersFromMarkers = function() {
    for (var i = this.markers_conf.offset; i < this.markers.length; ++i) {
        //extract options, test if value passed or use default
        var Lat = this.markers[i].lat;
        var Lng = this.markers[i].lng;

        //alter coordinates if randomize is true
        if ( this.markers_conf.randomize) {
          var LatLng = this.randomize(Lat, Lng);
          //retrieve coordinates from the æarray
          Lat = LatLng[0]; Lng = LatLng[1];
        }
        //save object
        this.markers[i].serviceObject = this.createMarker({
          "marker_picture":   this.exists(this.markers[i].picture)  ? this.markers[i].picture : this.markers_conf.picture,
          "marker_width":     this.exists(this.markers[i].width)    ? this.markers[i].width   : this.markers_conf.width,
          "marker_height":    this.exists(this.markers[i].height)   ? this.markers[i].height  : this.markers_conf.length,
          "marker_title":     this.exists(this.markers[i].title)    ? this.markers[i].title   : null,
          "marker_anchor":    this.exists(this.markers[i].marker_anchor)  ? this.markers[i].marker_anchor  : null,
          "shadow_anchor":    this.exists(this.markers[i].shadow_anchor)  ? this.markers[i].shadow_anchor  : null,
          "shadow_picture":   this.exists(this.markers[i].shadow_picture) ? this.markers[i].shadow_picture : null,
          "shadow_width":     this.exists(this.markers[i].shadow_width)   ? this.markers[i].shadow_width   : null,
          "shadow_height":    this.exists(this.markers[i].shadow_height)  ? this.markers[i].shadow_height  : null,
          "marker_draggable": this.exists(this.markers[i].draggable)      ? this.markers[i].draggable      : this.markers_conf.draggable,
          "rich_marker":      this.exists(this.markers[i].rich_marker)    ? this.markers[i].rich_marker    : null,
          "Lat":              Lat,
          "Lng":              Lng,
          "index":            i
        });
        //add infowindowstuff if enabled
        this.createInfoWindow(this.markers[i]);
        //create sidebar if enabled
        this.createSidebar(this.markers[i]);
    }
    this.markers_conf.offset = this.markers.length;
  }


  // creates Image Anchor Position or return null if nothing passed	
  this.createImageAnchorPosition = function(anchorLocation) {
    if (anchorLocation === null)
    { return null; }
    else
    { return this.createPoint(anchorLocation[0], anchorLocation[1]); }
  }

  // replace old markers with new markers on an existing map
  this.replaceMarkers = function(new_markers){
    this.clearMarkers();
    //reset previous markers
    this.markers = new Array;
    //reset current bounds
    this.boundsObject = this.createLatLngBounds();
    //reset sidebar content if exists
    this.resetSidebarContent();
    //add new markers
    this.addMarkers(new_markers);
  }

  //add new markers to on an existing map
  this.addMarkers = function(new_markers){
    //update the list of markers to take into account
    this.markers = this.markers.concat(new_markers);
    //put markers on the map
    this.create_markers();
  }  

  ////////////////////////////////////////////////////
  ///////////////////// SIDEBAR //////////////////////
  ////////////////////////////////////////////////////

  //creates sidebar
  this.createSidebar = function(marker_container){
    if (this.markers_conf.list_container)
    {
      var ul = document.getElementById(this.markers_conf.list_container);
      var li = document.createElement('li');
      var aSel = document.createElement('a');
      aSel.href = 'javascript:void(0);';
      var html = this.exists(marker_container.sidebar) ? marker_container.sidebar : "Marker";
      aSel.innerHTML = html;
      aSel.onclick = this.sidebar_element_handler(marker_container.serviceObject, 'click');
      li.appendChild(aSel);
      ul.appendChild(li);
    }
  }

  //moves map to marker clicked + open infowindow
  this.sidebar_element_handler = function(marker, eventType) {
    return function() {
      this.map.panTo(marker.position);
      google.maps.event.trigger(marker, eventType);
    };
  }

  this.resetSidebarContent = function(){
    if (this.markers_conf.list_container !== null ){
      var ul = document.getElementById(this.markers_conf.list_container);
      ul.innerHTML = "";
    }
  }

  ////////////////////////////////////////////////////
  ////////////////// MISCELLANEOUS ///////////////////
  ////////////////////////////////////////////////////

  //to make the map fit the different LatLng points
  this.adjustMapToBounds = function() {

    //FIRST_STEP: retrieve all bounds
    //create the bounds object only if necessary
    if (this.map_options.auto_adjust || this.map_options.bounds !== null) {
      this.boundsObject = this.createLatLngBounds();
    }

    //if autodjust is true, must get bounds from markers polylines etc...
    if (this.map_options.auto_adjust) {
      //from markers
      this.extendBoundsWithMarkers();
      //from polylines:
      for (var i = 0; i < this.polylines.length; ++i) {        
        var polyline_points = this.polylines[i].serviceObject.latLngs.getArray()[0].getArray();
        for (var j = 0; j < polyline_points.length; ++j) {
         this.boundsObject.extend(polyline_points[j]);
        }
      }
      //from polygons:
      for (var i = 0; i < this.polygons.length; ++i) {
        var polygon_points = this.polygons[i].serviceObject.latLngs.getArray()[0].getArray();
        for (var j = 0; j < polygon_points.length; ++j) {
          this.boundsObject.extend(polygon_points[j]);
        }
      }
      //from circles
      for (var i = 0; i <  this.circles.length; ++i) {
        this.boundsObject.extend(this.circles[i].serviceObject.getBounds().getNorthEast());
        this.boundsObject.extend(this.circles[i].serviceObject.getBounds().getSouthWest());
      }		
    }
    //in every case, I've to take into account the bounds set up by the user	
    for (var i = 0; i < this.map_options.bounds.length; ++i) {
      //create points from bounds provided
      //TODO:only works with google maps
      var bound = this.createLatLng(this.map_options.bounds[i].lat, this.map_options.bounds[i].lng);
      this.boundsObject.extend(bound);
    }

    //SECOND_STEP: ajust the map to the bounds
    if (this.map_options.auto_adjust || this.map_options.bounds.length > 0) {

      //if autozoom is false, take user info into account
      if(!this.map_options.auto_zoom) {
        var map_center = this.boundsObject.getCenter();
        this.map_options.center_latitude  = map_center.lat();
        this.map_options.center_longitude = map_center.lng();
        this.map.setCenter(map_center);
      }
      else {
        this.fitBounds();
      }
    }
  }
  
  ////////////////////////////////////////////////////
  /////////////////        KML      //////////////////
  ////////////////////////////////////////////////////
  
  this.create_kml = function(){
    for (var i = 0; i <  this.kml.length; ++i) {
      this.kml[i].serviceObject = this.createKmlLayer(this.kml[i]);
    }
  }


  ////////////////////////////////////////////////////
  ///////////////// Basic functions //////////////////
  ///////////////////tests coded//////////////////////

  //basic function to check existence of a variable
  this.exists = function(var_name) {
    return (var_name	!== "" && typeof var_name !== "undefined");
  }

  //randomize
  this.randomize = function(Lat0, Lng0) {
    //distance in meters between 0 and max_random_distance (positive or negative)
    var dx = this.markers_conf.max_random_distance * this.random();
    var dy = this.markers_conf.max_random_distance * this.random();
    var Lat = parseFloat(Lat0) + (180/Math.PI)*(dy/6378137);
    var Lng = parseFloat(Lng0) + ( 90/Math.PI)*(dx/6378137)/Math.cos(Lat0);
    return [Lat, Lng];
  }
  
  this.mergeObjectWithDefault = function(object1, object2){
    var copy_object1 = object1;
    for (var attrname in object2) {
      if ( typeof(copy_object1[attrname]) === "undefined") {
        copy_object1[attrname] = object2[attrname];
      } 
    }
    return copy_object1;
  }
  
  this.mergeWithDefault = function(objectName){
    var default_object = this["default_" + objectName];
    var object = this[objectName];
    this[objectName] = this.mergeObjectWithDefault(object, default_object);
    return true;
  }
  //gives a value between -1 and 1
  this.random = function() { return(Math.random() * 2 -1); }	

}
