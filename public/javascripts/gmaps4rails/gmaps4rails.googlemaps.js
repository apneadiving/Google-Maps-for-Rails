var Gmaps4RailsGoogle = function() {
  
  //Map settings
  this.map_options = {
    disableDefaultUI:       false,
    disableDoubleClickZoom: false,
    type:                   "ROADMAP" // HYBRID, ROADMAP, SATELLITE, TERRAIN
  };
  
  this.mergeWithDefault("map_options");
  
  //markers + info styling
  this.markers_conf = {
    clusterer_gridSize:      50,
    clusterer_maxZoom:       5,
    custom_cluster_pictures: null,
    custom_infowindow_class: null  
  };
  
  this.mergeWithDefault("markers_conf");
  
  this.kml_options = {
    clickable: true,
    preserveViewport: false,
    suppressInfoWindows: false
  }; 
  
  //Polygon Styling
  this.polygons_conf = {        // default style for polygons
    strokeColor: "#FFAA00",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#000000",
    fillOpacity: 0.35
  };

  //Polyline Styling
  this.polylines_conf = {           //default style for polylines
    strokeColor: "#FF0000",
    strokeOpacity: 1,
    strokeWeight: 2
  };

  //Circle Styling	
  this.circles_conf = {             //default style for circles
    fillColor: "#00AAFF",
    fillOpacity: 0.35,
    strokeColor: "#FFAA00",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    clickable: false,
    zIndex: null
  };

  //Direction Settings
  this.direction_conf = {
    panel_id:           null,
    display_panel:      false,
    origin:             null, 
    destination:        null,
    waypoints:          [],       //[{location: "toulouse,fr", stopover: true}, {location: "Clermont-Ferrand, fr", stopover: true}]
    optimizeWaypoints:  false,
    unitSystem:         "METRIC", //IMPERIAL
    avoidHighways:      false,
    avoidTolls:         false,
    region:             null, 
    travelMode:         "DRIVING" //WALKING, BICYCLING
  };

  ////////////////////////////////////////////////////
  /////////////// Basic Objects         //////////////
  ////////////////////////////////////////////////////

  this.createPoint = function(lat, lng){
    return new google.maps.Point(lat, lng);
  };

  this.createLatLng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
  };

  this.createLatLngBounds = function(){
    return new google.maps.LatLngBounds();
  };

  this.createMap = function(){
    return new google.maps.Map(document.getElementById(this.map_options.id), {
      maxZoom:                this.map_options.maxZoom,
      minZoom:                this.map_options.minZoom,
      zoom:                   this.map_options.zoom,
      center:                 this.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude),
      mapTypeId:              google.maps.MapTypeId[this.map_options.type],
      mapTypeControl:         this.map_options.mapTypeControl,
      disableDefaultUI:       this.map_options.disableDefaultUI,
      disableDoubleClickZoom: this.map_options.disableDoubleClickZoom,
      draggable:              this.map_options.draggable
    });
  };

  this.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
    return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
  };


  this.createSize = function(width, height){
    return new google.maps.Size(width, height);
  };

  ////////////////////////////////////////////////////
  ////////////////////// Markers /////////////////////
  ////////////////////////////////////////////////////

  this.createMarker = function(args){
    var markerLatLng = this.createLatLng(args.Lat, args.Lng); 

    // Marker sizes are expressed as a Size of X,Y
    if (args.marker_picture === "" && args.rich_marker === null) { 
      return new google.maps.Marker({position: markerLatLng, map: this.map, title: args.marker_title, draggable: args.marker_draggable});
    } 
    else if (args.rich_marker !== null){
      return new RichMarker({position: markerLatLng,
        map: this.map,
        draggable: args.marker_draggable,
        content: args.rich_marker,
        flat: args.marker_anchor === null ? false : args.marker_anchor[1],
        anchor: args.marker_anchor === null ? 0 : args.marker_anchor[0]
      });
    }
    else {
      // calculate MarkerImage anchor location
      var imageAnchorPosition  = this.createImageAnchorPosition(args.marker_anchor);
      var shadowAnchorPosition = this.createImageAnchorPosition(args.shadow_anchor);

      //create or retrieve existing MarkerImages
      var markerImage = this.createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition);
      var shadowImage = this.createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition);
      return new google.maps.Marker({position: markerLatLng, map: this.map, icon: markerImage, title: args.marker_title, draggable: args.marker_draggable, shadow: shadowImage});
    }
  };

  //checks if obj is included in arr Array and returns the position or false
  this.includeMarkerImage = function(arr, obj) {
    for(var i=0; i<arr.length; i++) {
      if (arr[i].url == obj) {return i;}
    }
    return false;
  };

  // checks if MarkerImage exists before creating a new one
  // returns a MarkerImage or false if ever something wrong is passed as argument
  this.createOrRetrieveImage = function(currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition){
    if (currentMarkerPicture === "" || currentMarkerPicture === null )
    { return null;}

    var test_image_index = this.includeMarkerImage(this.markerImages, currentMarkerPicture);		
    switch (test_image_index)
    { 
      case false:
      var markerImage = this.createMarkerImage(currentMarkerPicture, this.createSize(markerWidth, markerHeight), null, imageAnchorPosition, null );
      this.markerImages.push(markerImage);
      return markerImage;  	
      break; 
      default:
      if (typeof test_image_index == 'number') { return this.markerImages[test_image_index]; }
      else { return false; }
      break; 
    }		
  };

  // clear markers
  this.clearMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.clearMarker(this.markers[i]);
    }
  };

  //show and hide markers
  this.showMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.showMarker(this.markers[i]);
    }
  };

  this.hideMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.hideMarker(this.markers[i]);
    }
  };

  this.clearMarker = function(marker) {
    marker.serviceObject.setMap(null);
  };

  this.showMarker = function(marker) {
    marker.serviceObject.setVisible(true);
  };

  this.hideMarker = function(marker) {
    marker.serviceObject.setVisible(false);
  };

  this.extendBoundsWithMarkers = function(){
    for (var i = 0; i <  this.markers.length; ++i) {
      this.boundsObject.extend(this.markers[i].serviceObject.position);
    }
  };

  ////////////////////////////////////////////////////
  /////////////////// Clusterer //////////////////////
  ////////////////////////////////////////////////////

  this.createClusterer = function(markers_array){
    return new MarkerClusterer( this.map,
      markers_array, 
      {	maxZoom: this.markers_conf.clusterer_maxZoom, gridSize: this.markers_conf.clusterer_gridSize, styles: this.customClusterer() }
    );	
  };

  this.clearClusterer = function() {
    this.markerClusterer.clearMarkers();
  };

  //creates clusters
  this.clusterize = function()
  {
    if (this.markers_conf.do_clustering === true)
    {
      //first clear the existing clusterer if any
      if (this.markerClusterer !== null) {
        this.clearClusterer();
      }

      var markers_array = new Array;
      for (var i = 0; i <  this.markers.length; ++i) {
        markers_array.push(this.markers[i].serviceObject);
      }

      this.markerClusterer = this.createClusterer(markers_array);
    }
  };

  ////////////////////////////////////////////////////
  /////////////////// INFO WINDOW ////////////////////
  ////////////////////////////////////////////////////

  // creates infowindows
  this.createInfoWindow = function(marker_container){
    var info_window;
    if (this.markers_conf.custom_infowindow_class === null && this.exists(marker_container.description)) {
      //create the infowindow
      info_window = new google.maps.InfoWindow({content: marker_container.description });
      //add the listener associated
      google.maps.event.addListener(marker_container.serviceObject, 'click', this.openInfoWindow(info_window, marker_container.serviceObject));
    }
    else { //creating custom infowindow
      if (this.exists(marker_container.description)) {
        var boxText = document.createElement("div");
        boxText.setAttribute("class", this.markers_conf.custom_infowindow_class); //to customize
        boxText.innerHTML = marker_container.description;	
        info_window = new InfoBox(this.infobox(boxText));
        google.maps.event.addListener(marker_container.serviceObject, 'click', this.openInfoWindow(info_window, marker_container.serviceObject));
      }
    }
  };

  this.openInfoWindow = function(infoWindow, marker) {
    return function() {
      // Close the latest selected marker before opening the current one.
      if (this.visibleInfoWindow) {
        this.visibleInfoWindow.close();
      }

      infoWindow.open(this.map, marker);
      this.visibleInfoWindow = infoWindow;
    };
  };
  
  ////////////////////////////////////////////////////
  /////////////////        KML      //////////////////
  ////////////////////////////////////////////////////
  
  this.createKmlLayer = function(kml){
    var kml_options = kml.options || {};
    kml_options = this.mergeObjectWithDefault(kml_options, this.kml_options);
    var kml =  new google.maps.KmlLayer( kml.url,
                                         kml_options 
                                       );
    kml.setMap(this.map);
    return kml;                     
  };


  ////////////////////////////////////////////////////
  /////////////////// Other methods //////////////////
  ////////////////////////////////////////////////////

  this.fitBounds = function(){
    this.map.fitBounds(this.boundsObject); 
  };

  this.centerMapOnUser = function(){
    this.map.setCenter(this.userLocation);
  };
};

Gmaps4RailsGoogle.prototype = new Gmaps4Rails();
