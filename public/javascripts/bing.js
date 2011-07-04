////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////
// http://msdn.microsoft.com/en-us/library/gg427611.aspx
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
  return new Microsoft.Maps.Point(lat, lng);
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

Gmaps4Rails.addToMap = function(object){
  Gmaps4Rails.map.entities.push(object);
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
  var info_window;
  if (Gmaps4Rails.exists(marker_container.description)) {
    //create the infowindow
    info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), {description: marker_container.description, visible: false});
                                     
    //add the listener associated
    Microsoft.Maps.Events.addHandler(info_window, 'click', Gmaps4Rails.openInfoWindow(info_window));
    Gmaps4Rails.addToMap(info_window);
  }
};

Gmaps4Rails.openInfoWindow = function(infoWindow) {
  return function() {
      // Close the latest selected marker before opening the current one.
    if (Gmaps4Rails.visibleInfoWindow) {
      Gmaps4Rails.setOptions({ visible: false });
    }
    infoWindow.setOptions({ visible:true });
    Gmaps4Rails.visibleInfoWindow = infoWindow;
  }
};