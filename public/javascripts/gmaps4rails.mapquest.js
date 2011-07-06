////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////
// http://www.mapquestapi.com/sdk/js/v6.0.0/poi.html
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
  return new MQA.Poi({lat: lat, lng: lng});
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new MQA.Poi({lat: lat, lng: lng});
};

Gmaps4Rails.createLatLngBounds = function(){
 // return new google.maps.LatLngBounds();
};

Gmaps4Rails.createMap = function(){
  var map = new MQA.TileMap(                           // Constructs an instance of MQA.TileMap
    document.getElementById("mapQuest"),     //the id of the element on the page you want the map to be added into 
    Gmaps4Rails.map_options.zoom,                   //intial zoom level of the map
    {lat: Gmaps4Rails.map_options.center_latitude,  //the lat/lng of the map to center on
     lng: Gmaps4Rails.map_options.center_longitude}, 
    'map');                                         //map type (map, sat, hyb)
  MQA.withModule('zoomcontrol3', function() {

    map.addControl(
      new MQA.LargeZoomControl3(), 
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT)
    );

  });
  return map;
};

Gmaps4Rails.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
  return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
};

Gmaps4Rails.createMarker = function(args){
  return new MQA.Poi({lat: 0, lng: 0});
};

Gmaps4Rails.createMarker = function(args){
  
  	var marker = new MQA.Poi( {lat: args.Lat, lng: args.Lng} );
  	
  	if(args.marker_anchor !== null) {
  	  marker.setBias({x: args.marker_anchor[0], y: args.marker_anchor[1]});
    }

  	if (args.marker_picture !== "" ) { 
  	  var icon = new MQA.Icon(args.marker_picture, args.marker_height, args.marker_width);
    	marker.setIcon(icon);
    }
  	
  	Gmaps4Rails.addToMap(marker);
  	return marker;
};

Gmaps4Rails.addToMap = function(object){
  Gmaps4Rails.map.addShape(object);
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

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  marker_container.serviceObject.setInfoContentHTML(marker_container.description);
//  marker_container.serviceObject.setRolloverContent(marker_container.title)
};