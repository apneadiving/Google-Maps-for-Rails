////////////////////////////////////////////////////
/////////////// Basic Objects         //////////////
////////////////////////////////////////////////////

Gmaps4Rails.createPoint = function(lat, lng){
  return new Microsoft.Maps.Point(lat, lng);
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new Microsoft.Maps.Location(lat, lng);
};

Gmaps4Rails.createLatLngBounds = function(){
// return new Microsoft.Maps.LocationRect();
};

Gmaps4Rails.createMap = function(){
  return new Microsoft.Maps.Map(document.getElementById(Gmaps4Rails.map_options.id), { 
    credentials:  Gmaps4Rails.apiKey,
    mapTypeId:    Microsoft.Maps.MapTypeId.road,
    center:       Gmaps4Rails.createLatLng(Gmaps4Rails.map_options.center_latitude, Gmaps4Rails.map_options.center_longitude),
    zoom:                   Gmaps4Rails.map_options.zoom,
 });
};

Gmaps4Rails.createSize = function(width, height){
  return new google.maps.Size(width, height);
};

////////////////////////////////////////////////////
////////////////////// Markers /////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createMarker = function(args){
  var markerLatLng = Gmaps4Rails.createLatLng(args.Lat, args.Lng); 
  var marker;
  // Marker sizes are expressed as a Size of X,Y
  if (args.marker_picture === "" ) { 
    marker = new Microsoft.Maps.Pushpin(Gmaps4Rails.createLatLng(args.Lat, args.Lng), {
     draggable: args.marker_draggable,
     anchor:    Gmaps4Rails.createImageAnchorPosition(args.Lat, args.Lng),
     text:      args.marker_title
     }
    );
  } else {
    marker = new Microsoft.Maps.Pushpin(Gmaps4Rails.createLatLng(args.Lat, args.Lng), {
     draggable: args.marker_draggable,
     anchor:    Gmaps4Rails.createImageAnchorPosition(args.Lat, args.Lng),
     icon:      args.marker_picture,
     height:    args.marker_height,
     text:      args.marker_title,
     width:     args.marker_width
     }
    );
   }
  Gmaps4Rails.addToMap(marker);
  return marker;
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
  var locationsArray = [];
  for (var i = 0; i <  this.markers.length; ++i) {
    locationsArray.push(Gmaps4Rails.markers[i].serviceObject.getLocation());        
  } 
  Gmaps4Rails.boundsObject = Microsoft.Maps.LocationRect.fromLocations(locationsArray);
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
  // if (this.markers_conf.do_clustering === true)
  // {
  //   //first clear the existing clusterer if any
  //   if (this.markerClusterer !== null) {
  //     this.clearClusterer();
  //   }
  // 
  //   var markers_array = new Array;
  //   for (var i = 0; i <  this.markers.length; ++i) {
  //     markers_array.push(this.markers[i].serviceObject);
  //   }
  // 
  //   this.markerClusterer = Gmaps4Rails.createClusterer(markers_array);
  // }
};

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  var info_window;
  if (Gmaps4Rails.exists(marker_container.description)) {
    //create the infowindow
    marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), {description: marker_container.description, visible: false});
                                     
    //add the listener associated
    Microsoft.Maps.Events.addHandler(marker_container.info_window, 'click', Gmaps4Rails.openInfoWindow(marker_container.info_window));
    Gmaps4Rails.addToMap(marker_container.info_window);
  }
};

Gmaps4Rails.openInfoWindow = function(infoWindow) {
      // Close the latest selected marker before opening the current one.
    if (Gmaps4Rails.visibleInfoWindow) {
      Gmaps4Rails.visibleInfoWindow.setOptions({ visible: false });
    }
    infoWindow.setOptions({ visible:true });
    Gmaps4Rails.visibleInfoWindow = infoWindow;
};

////////////////////////////////////////////////////
/////////////////// Other methods //////////////////
////////////////////////////////////////////////////

Gmaps4Rails.fitBounds = function(){
  Gmaps4Rails.map.setView({bounds: Gmaps4Rails.boundsObject});
};

Gmaps4Rails.addToMap = function(object){
  Gmaps4Rails.map.entities.push(object);
};