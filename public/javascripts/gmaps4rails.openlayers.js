////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////
// http://wiki.openstreetmap.org/wiki/OpenLayers
// http://openlayers.org/dev/examples
Gmaps4Rails.createPoint = function(lat, lng){
  //return new Microsoft.Maps.Point(lat, lng);
};

Gmaps4Rails.createLatLng = function(lat, lng){
  return new OpenLayers.LonLat(lng, lat)
            .transform(
              new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
              new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
            );
};

Gmaps4Rails.createLatLngBounds = function(){
   return new OpenLayers.Bounds();
};

Gmaps4Rails.extendBoundsWithMarkers = function(){
  for (var i = 0; i <  this.markers.length; ++i) {
    Gmaps4Rails.boundsObject.extend(Gmaps4Rails.markers[i].serviceObject.lonlat);        
  } 
};


Gmaps4Rails.fitBounds = function(){
  Gmaps4Rails.map.zoomToExtent(Gmaps4Rails.boundsObject, true)
  //toBBOX();
};

Gmaps4Rails.createMap = function(){
  
  var map = new OpenLayers.Map(Gmaps4Rails.map_options.id);
  map.addLayer(new OpenLayers.Layer.OSM());
  map.setCenter(Gmaps4Rails.createLatLng(Gmaps4Rails.map_options.center_latitude, Gmaps4Rails.map_options.center_longitude), // Center of the map
                Gmaps4Rails.map_options.zoom // Zoom level
               );  
  return map;
};

Gmaps4Rails.createMarker = function(args){
  var marker;
  if (args.index == 0) {
    Gmaps4Rails.openMarkers = new OpenLayers.Layer.Markers( "Markers" );
    Gmaps4Rails.map.addLayer(Gmaps4Rails.openMarkers);
  }
  if (args.marker_picture === "" ) { 
    marker = new OpenLayers.Marker(Gmaps4Rails.createLatLng(args.Lat, args.Lng));
  } else {
    var anchor = Gmaps4Rails.createAnchor(args.marker_anchor);
    var icon = new OpenLayers.Icon(args.marker_picture, Gmaps4Rails.createSize(args.marker_width, args.marker_height), anchor);
    marker   = new OpenLayers.Marker(Gmaps4Rails.createLatLng(args.Lat, args.Lng), icon);
  }
  
  Gmaps4Rails.openMarkers.addMarker(marker);
  return marker;
};

Gmaps4Rails.createAnchor = function(offset){
  if (offset === null)
    { return null; }
  else {
   return new OpenLayers.Pixel(offset[0], offset[1]);
  }
};

Gmaps4Rails.addToMap = function(object){
  Gmaps4Rails.map.entities.push(object);
};

Gmaps4Rails.createSize = function(width, height){
  return new OpenLayers.Size(width, height);
};

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  var info_window;
  if (Gmaps4Rails.exists(marker_container.description)) {
    //create the infowindow
    var feature = new OpenLayers.Feature(Gmaps4Rails.openMarkers, marker_container.serviceObject.lonlat); 
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, { 'autoSize': true });
    
    //other examples here : http://openlayers.org/dev/examples/popupMatrix.html
    //feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, { 'autoSize': true });
    
    feature.data.popupContentHTML = marker_container.description;
    feature.data.overflow = "auto";   
    marker_container.serviceObject.events.register("mousedown", feature, Gmaps4Rails.openInfoWindow);
  }
};

Gmaps4Rails.openInfoWindow = function(evt) {
  if (this.popup == null) {
      this.popup = this.createPopup(this.closeBox);
      Gmaps4Rails.map.addPopup(this.popup);
      this.popup.show();
  } else {
      this.popup.toggle();
  }
  //hide the previous if open
  if (Gmaps4Rails.visibleInfoWindow !== null) { Gmaps4Rails.visibleInfoWindow.hide(); }
  
  Gmaps4Rails.visibleInfoWindow = this.popup;
  OpenLayers.Event.stop(evt);
};


Gmaps4Rails.createClusterer = function(markers_array){

};

Gmaps4Rails.clusterize = function() {
};

// clear markers
Gmaps4Rails.clearMarkers = function() {
  Gmaps4Rails.map.removeLayer(Gmaps4Rails.openMarkers);
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