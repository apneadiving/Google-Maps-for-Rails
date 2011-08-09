// http://www.mapquestapi.com/sdk/js/v6.0.0/poi.html

//Map settings
Gmaps4Rails.map_options.type =  "map";  // //map type (map, sat, hyb)


////////////////////////////////////////////////////
/////////////// Basic Objects         //////////////
////////////////////////////////////////////////////

Gmaps4Rails.createPoint = function(lat, lng){
  return new MQA.Poi({lat: lat, lng: lng});
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return {lat: lat, lng: lng};
};

Gmaps4Rails.createLatLngBounds = function(){
};


Gmaps4Rails.createMap = function(){
  var map = new MQA.TileMap(                            // Constructs an instance of MQA.TileMap
    document.getElementById("mapQuest"),                //the id of the element on the page you want the map to be added into 
    Gmaps4Rails.map_options.zoom,                       //intial zoom level of the map
    {lat: Gmaps4Rails.map_options.center_latitude,      //the lat/lng of the map to center on
     lng: Gmaps4Rails.map_options.center_longitude}, 
    Gmaps4Rails.map_options.type);                                             //map type (map, sat, hyb)
  MQA.withModule('zoomcontrol3', function() {

    map.addControl(
      new MQA.LargeZoomControl3(), 
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT)
    );

  });
  return map;
};

Gmaps4Rails.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {

};


////////////////////////////////////////////////////
////////////////////// Markers /////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createMarker = function(args){
  
  var marker = new MQA.Poi( {lat: args.Lat, lng: args.Lng} );
  
  if (args.marker_picture !== "" ) { 
    var icon = new MQA.Icon(args.marker_picture, args.marker_height, args.marker_width);
    marker.setIcon(icon);
    if(args.marker_anchor !== null) {
      marker.setBias({x: args.marker_anchor[0], y: args.marker_anchor[1]});
    }
  }

  if (args.shadow_picture !== "" ) { 
    var icon = new MQA.Icon(args.shadow_picture, args.shadow_height, args.shadow_width);
    marker.setShadow(icon);
    
    if(args.shadow_anchor !== null) {
      marker.setShadowOffset({x: args.shadow_anchor[0], y: args.shadow_anchor[1]});
      }
  }  

  Gmaps4Rails.addToMap(marker);
  return marker;
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
  this.removeFromMap(marker.serviceObject);
};

Gmaps4Rails.showMarker = function(marker) {
  // marker.serviceObject
};

Gmaps4Rails.hideMarker = function(marker) {
  // marker.serviceObject
};

Gmaps4Rails.extendBoundsWithMarkers = function(){
  
  if (Gmaps4Rails.markers.length >=2) {
    Gmaps4Rails.boundsObject = new MQA.RectLL(Gmaps4Rails.markers[0].serviceObject.latLng, Gmaps4Rails.markers[1].serviceObject.latLng);
    
    for (var i = 2; i <  Gmaps4Rails.markers.length; ++i) {
      Gmaps4Rails.boundsObject.extend(Gmaps4Rails.markers[i].serviceObject.latLng);
    }
  }

};

////////////////////////////////////////////////////
/////////////////// Clusterer //////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createClusterer = function(markers_array){

};

Gmaps4Rails.clearClusterer = function() {

};

//creates clusters
Gmaps4Rails.clusterize = function()
{

};

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  marker_container.serviceObject.setInfoTitleHTML(marker_container.description);
  //TODO: how to disable the mouseover display when using setInfoContentHTML?
  //marker_container.serviceObject.setInfoContentHTML(marker_container.description);
};

////////////////////////////////////////////////////
/////////////////// Other methods //////////////////
////////////////////////////////////////////////////

Gmaps4Rails.fitBounds = function(){
  if (Gmaps4Rails.markers.length >=2) {
    Gmaps4Rails.map.zoomToRect(Gmaps4Rails.boundsObject);
  }
  if (Gmaps4Rails.markers.length ==1 ) {
    Gmaps4Rails.map.setCenter(Gmaps4Rails.markers[0].serviceObject.latLng);
  }
};

Gmaps4Rails.centerMapOnUser = function(){
  Gmaps4Rails.map.setCenter(Gmaps4Rails.userLocation);
};

Gmaps4Rails.addToMap = function(object){
  Gmaps4Rails.map.addShape(object);
};

Gmaps4Rails.removeFromMap = function(object){
  Gmaps4Rails.map.removeShape(object);
}