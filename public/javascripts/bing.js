////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////

Gmaps4Rails.clearMarker = function(marker) {
  marker.serviceObject.setMap(null);
};

Gmaps4Rails.showMarker = function(marker) {
  marker.serviceObject.setVisible(true);
};

Gmaps4Rails.hideMarker = function(marker) {
  marker.serviceObject.setVisible(false);
};

Gmaps4Rails.createPoint = function(lat, lng){
  return new VELatLong(lat, lng);
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new Microsoft.Maps.Location(lat, lng);
};

Gmaps4Rails.createLatLngBounds = function(){
  //Microsoft.Maps.LocationRect
 // return new google.maps.LatLngBounds();
};

Gmaps4Rails.createMap = function(){
  return new Microsoft.Maps.Map(document.getElementById(Gmaps4Rails.map_options.id), { 
    credentials:  Gmaps4Rails.apiKey,
    mapTypeId:    Microsoft.Maps.MapTypeId.road,
    center:       Gmaps4Rails.createLatLng(Gmaps4Rails.map_options.center_latitude, Gmaps4Rails.map_options.center_longitude),
    zoom:                   Gmaps4Rails.map_options.zoom,
 });
};

Gmaps4Rails.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
  return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
};

//{position: markerLatLng, map: this.map, title: marker_title, draggable: marker_draggable}
Gmaps4Rails.createMarker = function(args){
   var marker = new Microsoft.Maps.Pushpin({location: args.position, draggable: args.draggable});
   
   return marker;
};

Gmaps4Rails.createSize = function(width, height){
  return new google.maps.Size(width, height);
};

Gmaps4Rails.createClusterer = function(markers_array){
  // return new MarkerClusterer( Gmaps4Rails.map,
  //   markers_array, 
  //   {  maxZoom: this.markers_conf.clusterer_maxZoom, gridSize: this.markers_conf.clusterer_gridSize, styles: Gmaps4Rails.customClusterer() }
  // ); 
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
