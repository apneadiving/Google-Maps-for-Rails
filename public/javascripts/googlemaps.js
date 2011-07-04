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
  return new google.maps.Marker(args);
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
