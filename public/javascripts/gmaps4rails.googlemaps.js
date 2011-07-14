//Map settings
Gmaps4Rails.map_options.disableDefaultUI = false;
Gmaps4Rails.map_options.disableDoubleClickZoom = false;
Gmaps4Rails.map_options.type =  "ROADMAP";  // HYBRID, ROADMAP, SATELLITE, TERRAIN

//markers + info styling
Gmaps4Rails.markers_conf.clusterer_gridSize = 50; 
Gmaps4Rails.markers_conf.clusterer_maxZoom = 5;
Gmaps4Rails.markers_conf.custom_cluster_pictures = null;
Gmaps4Rails.markers_conf.custom_infowindow_class = null;

//Polygon Styling
Gmaps4Rails.polygons_conf = {        // default style for polygons
  strokeColor: "#FFAA00",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#000000",
  fillOpacity: 0.35
};

//Polyline Styling
Gmaps4Rails.polylines_conf = {           //default style for polylines
  strokeColor: "#FF0000",
  strokeOpacity: 1,
  strokeWeight: 2
};

//Circle Styling	
Gmaps4Rails.circles_conf = {             //default style for circles
  fillColor: "#00AAFF",
  fillOpacity: 0.35,
  strokeColor: "#FFAA00",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  zIndex: null
};

//Direction Settings
Gmaps4Rails.direction_conf = {
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

Gmaps4Rails.createPoint = function(lat, lng){
  return new google.maps.Point(lat, lng);
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};

Gmaps4Rails.createLatLngBounds = function(){
  return new google.maps.LatLngBounds();
};

Gmaps4Rails.createMap = function(){
  return new google.maps.Map(document.getElementById(Gmaps4Rails.map_options.id), {
    maxZoom:                Gmaps4Rails.map_options.maxZoom,
    minZoom:                Gmaps4Rails.map_options.minZoom,
    zoom:                   Gmaps4Rails.map_options.zoom,
    center:                 Gmaps4Rails.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude),
    mapTypeId:              google.maps.MapTypeId[this.map_options.type],
    mapTypeControl:         Gmaps4Rails.map_options.mapTypeControl,
    disableDefaultUI:       Gmaps4Rails.map_options.disableDefaultUI,
    disableDoubleClickZoom: Gmaps4Rails.map_options.disableDoubleClickZoom,
    draggable:              Gmaps4Rails.map_options.draggable
  });
};

Gmaps4Rails.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
  return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
};


Gmaps4Rails.createSize = function(width, height){
  return new google.maps.Size(width, height);
};

////////////////////////////////////////////////////
////////////////////// Markers /////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createMarker = function(args){
  var markerLatLng = Gmaps4Rails.createLatLng(args.Lat, args.Lng); 

  // Marker sizes are expressed as a Size of X,Y
  if (args.marker_picture === "" ) { 
    return new google.maps.Marker({position: markerLatLng, map: Gmaps4Rails.map, title: args.marker_title, draggable: args.marker_draggable});
  } else {
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
Gmaps4Rails.includeMarkerImage = function(arr, obj) {
  for(var i=0; i<arr.length; i++) {
    if (arr[i].url == obj) {return i;}
  }
  return false;
};

// checks if MarkerImage exists before creating a new one
// returns a MarkerImage or false if ever something wrong is passed as argument
Gmaps4Rails.createOrRetrieveImage = function(currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition){
  if (currentMarkerPicture === "" || currentMarkerPicture === null )
  { return null;}

  var test_image_index = this.includeMarkerImage(this.markerImages, currentMarkerPicture);		
  switch (test_image_index)
  { 
    case false:
    var markerImage = Gmaps4Rails.createMarkerImage(currentMarkerPicture, Gmaps4Rails.createSize(markerWidth, markerHeight), null, imageAnchorPosition, null );
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
Gmaps4Rails.clearMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.clearMarker(this.markers[i]);
  }
};

//show and hide markers
Gmaps4Rails.showMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.showMarker(this.markers[i]);
  }
};

Gmaps4Rails.hideMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.hideMarker(this.markers[i]);
  }
};

Gmaps4Rails.clearMarker = function(marker) {
  marker.serviceObject.setMap(null);
};

Gmaps4Rails.showMarker = function(marker) {
  marker.serviceObject.setVisible(true);
};

Gmaps4Rails.hideMarker = function(marker) {
  marker.serviceObject.setVisible(false);
};

Gmaps4Rails.extendBoundsWithMarkers = function(){
  for (var i = 0; i <  Gmaps4Rails.markers.length; ++i) {
    Gmaps4Rails.boundsObject.extend(Gmaps4Rails.markers[i].serviceObject.position);
  }
};

////////////////////////////////////////////////////
/////////////////// Clusterer //////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createClusterer = function(markers_array){
  return new MarkerClusterer( Gmaps4Rails.map,
    markers_array, 
    {	maxZoom: Gmaps4Rails.markers_conf.clusterer_maxZoom, gridSize: Gmaps4Rails.markers_conf.clusterer_gridSize, styles: Gmaps4Rails.customClusterer() }
  );	
};

Gmaps4Rails.clearClusterer = function() {
  this.markerClusterer.clearMarkers();
};

//creates clusters
Gmaps4Rails.clusterize = function()
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

    this.markerClusterer = Gmaps4Rails.createClusterer(markers_array);
  }
};

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  var info_window;
  if (this.markers_conf.custom_infowindow_class === null && Gmaps4Rails.exists(marker_container.description)) {
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
      info_window = new InfoBox(Gmaps4Rails.infobox(boxText));
      google.maps.event.addListener(marker_container.serviceObject, 'click', this.openInfoWindow(info_window, marker_container.serviceObject));
    }
  }
};

Gmaps4Rails.openInfoWindow = function(infoWindow, marker) {
  return function() {
    // Close the latest selected marker before opening the current one.
    if (Gmaps4Rails.visibleInfoWindow) {
      Gmaps4Rails.visibleInfoWindow.close();
    }

    infoWindow.open(Gmaps4Rails.map, marker);
    Gmaps4Rails.visibleInfoWindow = infoWindow;
  };
};

////////////////////////////////////////////////////
/////////////////// Other methods //////////////////
////////////////////////////////////////////////////

Gmaps4Rails.fitBounds = function(){
  this.map.fitBounds(this.boundsObject); 
};

Gmaps4Rails.centerMapOnUser = function(){
  Gmaps4Rails.map.setCenter(Gmaps4Rails.userLocation);
};