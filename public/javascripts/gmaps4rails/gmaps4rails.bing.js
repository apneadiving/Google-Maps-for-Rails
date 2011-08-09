Gmaps4Rails.map_options.type =  "road";             // aerial, auto, birdseye, collinsBart, mercator, ordnanceSurvey, road
Gmaps4Rails.markers_conf.infobox =  "description";  // description or htmlContent

////////////////////////////////////////////////////
/////////////// Basic Objects         //////////////
////////////////////////////////////////////////////

Gmaps4Rails.getMapType = function(){
  switch(Gmaps4Rails.map_options.type)
  {
  case "road":
    return Microsoft.Maps.MapTypeId.road;
  case "aerial":
    return Microsoft.Maps.MapTypeId.aerial;
  case "auto":
    return Microsoft.Maps.MapTypeId.auto;
  case "birdseye":
    return Microsoft.Maps.MapTypeId.birdseye;
  case "collinsBart":
    return Microsoft.Maps.MapTypeId.collinsBart;
  case "mercator":
    return Microsoft.Maps.MapTypeId.mercator;
  case "ordnanceSurvey":
    return Microsoft.Maps.MapTypeId.ordnanceSurvey;
  default:
    return Microsoft.Maps.MapTypeId.auto;
  }
};

Gmaps4Rails.createPoint = function(lat, lng){
  return new Microsoft.Maps.Point(lat, lng);
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new Microsoft.Maps.Location(lat, lng);
};

Gmaps4Rails.createLatLngBounds = function(){

};

Gmaps4Rails.createMap = function(){
  return new Microsoft.Maps.Map(document.getElementById(Gmaps4Rails.map_options.id), { 
    credentials:  Gmaps4Rails.map_options.provider_key,
    mapTypeId:    Gmaps4Rails.getMapType(),
    center:       Gmaps4Rails.createLatLng(Gmaps4Rails.map_options.center_latitude, Gmaps4Rails.map_options.center_longitude),
    zoom:         Gmaps4Rails.map_options.zoom
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

// clear markers
Gmaps4Rails.clearMarkers = function() {  
  for (var i = 0; i < this.markers.length; ++i) {
    this.clearMarker(this.markers[i]);
  }
};

Gmaps4Rails.clearMarker = function(marker) {
  this.removeFromMap(marker.serviceObject);
};

//show and hide markers
Gmaps4Rails.showMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.showMarker(this.markers[i]);
  }
};

Gmaps4Rails.showMarker = function(marker) {
  marker.serviceObject.setOptions({ visible: true });
};

Gmaps4Rails.hideMarkers = function() {
  for (var i = 0; i < this.markers.length; ++i) {
    this.hideMarker(this.markers[i]);
  }
};

Gmaps4Rails.hideMarker = function(marker) {
  marker.serviceObject.setOptions({ visible: false });
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
  var info_window;
  if (Gmaps4Rails.exists(marker_container.description)) {
    //create the infowindow
    if (Gmaps4Rails.markers_conf.infobox == "description") {
      marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), { description: marker_container.description, visible: false, showCloseButton: true});  
    }
    else {
      marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), { htmlContent: marker_container.description, visible: false});
    }
                                     
    //add the listener associated
    Microsoft.Maps.Events.addHandler(marker_container.serviceObject, 'click', Gmaps4Rails.openInfoWindow(marker_container.info_window));
    Gmaps4Rails.addToMap(marker_container.info_window);
  }
};

Gmaps4Rails.openInfoWindow = function(infoWindow) {
  return function() {
      // Close the latest selected marker before opening the current one.
      if (Gmaps4Rails.visibleInfoWindow) {
        Gmaps4Rails.visibleInfoWindow.setOptions({ visible: false });
      }
      infoWindow.setOptions({ visible:true });
      Gmaps4Rails.visibleInfoWindow = infoWindow;
    };
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

Gmaps4Rails.removeFromMap = function(object){
  console.log(object);
  Gmaps4Rails.map.entities.remove(object);
};

Gmaps4Rails.centerMapOnUser = function(){
  Gmaps4Rails.map.setView({ center: Gmaps4Rails.userLocation});
};