////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////

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

Gmaps4Rails.createSize = function(width, height){
  return new google.maps.Size(width, height);
};

Gmaps4Rails.createClusterer = function(markers_array){
  return new MarkerClusterer( Gmaps4Rails.map,
    markers_array, 
    {	maxZoom: this.markers_conf.clusterer_maxZoom, gridSize: this.markers_conf.clusterer_gridSize, styles: Gmaps4Rails.customClusterer() }
  );	
};

Gmaps4Rails.clearClusterer = function() {
  this.markerClusterer.clearMarkers();
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

Gmaps4Rails.extendBoundsWithMarkers = function(){
  for (var i = 0; i <  Gmaps4Rails.markers.length; ++i) {
    Gmaps4Rails.boundsObject.extend(Gmaps4Rails.markers[i].serviceObject.position);
  }
};

Gmaps4Rails.fitBounds = function(){
  this.map.fitBounds(this.boundsObject); 
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

// clear markers
Gmaps4Rails.clearMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.clearMarker(this.markers[i]);
  }
};

// show and hide markers
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