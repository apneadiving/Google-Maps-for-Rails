var Gmaps4RailsMapquest = function() {

  // http://www.mapquestapi.com/sdk/js/v6.0.0/poi.html

  //Map settings
  this.map_options = {
    type:  "map"  // //map type (map, sat, hyb)
  };
  this.markers_conf = {};

  this.mergeWithDefault("markers_conf");
  this.mergeWithDefault("map_options");

  ////////////////////////////////////////////////////
  /////////////// Basic Objects         //////////////
  ////////////////////////////////////////////////////

  this.createPoint = function(lat, lng){
    return new MQA.Poi({lat: lat, lng: lng});
  };

  this.createLatLng = function(lat, lng){
    return {lat: lat, lng: lng};
  };

  this.createLatLngBounds = function(){
  };


  this.createMap = function(){
    var map = new MQA.TileMap(                            // Constructs an instance of MQA.TileMap
      document.getElementById(this.map_options.id),                //the id of the element on the page you want the map to be added into 
      this.map_options.zoom,                       //intial zoom level of the map
      {lat: this.map_options.center_latitude,      //the lat/lng of the map to center on
       lng: this.map_options.center_longitude}, 
      this.map_options.type);                                             //map type (map, sat, hyb)
    MQA.withModule('zoomcontrol3', function() {

      map.addControl(
        new MQA.LargeZoomControl3(), 
        new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT)
      );

    });
    return map;
  };

  this.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {

  };


  ////////////////////////////////////////////////////
  ////////////////////// Markers /////////////////////
  ////////////////////////////////////////////////////

  this.createMarker = function(args){
  
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

    this.addToMap(marker);
    return marker;
  };


  // clear markers
  this.clearMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.clearMarker(this.markers[i]);
    }
  };

  //show and hide markers
  this.showMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.showMarker(this.markers[i]);
    }
  };

  this.hideMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.hideMarker(this.markers[i]);
    }
  };

  this.clearMarker = function(marker) {
    this.removeFromMap(marker.serviceObject);
  };

  this.showMarker = function(marker) {
    // marker.serviceObject
  };

  this.hideMarker = function(marker) {
    // marker.serviceObject
  };

  this.extendBoundsWithMarkers = function(){
  
    if (this.markers.length >=2) {
      this.boundsObject = new MQA.RectLL(this.markers[0].serviceObject.latLng, this.markers[1].serviceObject.latLng);
    
      for (var i = 2; i <  this.markers.length; ++i) {
        this.boundsObject.extend(this.markers[i].serviceObject.latLng);
      }
    }

  };

  ////////////////////////////////////////////////////
  /////////////////// Clusterer //////////////////////
  ////////////////////////////////////////////////////

  this.createClusterer = function(markers_array){

  };

  this.clearClusterer = function() {

  };

  //creates clusters
  this.clusterize = function()
  {

  };

  ////////////////////////////////////////////////////
  /////////////////// INFO WINDOW ////////////////////
  ////////////////////////////////////////////////////

  // creates infowindows
  this.createInfoWindow = function(marker_container){
    marker_container.serviceObject.setInfoTitleHTML(marker_container.description);
    //TODO: how to disable the mouseover display when using setInfoContentHTML?
    //marker_container.serviceObject.setInfoContentHTML(marker_container.description);
  };

  ////////////////////////////////////////////////////
  /////////////////// Other methods //////////////////
  ////////////////////////////////////////////////////

  this.fitBounds = function(){
    if (this.markers.length >=2) {
      this.map.zoomToRect(this.boundsObject);
    }
    if (this.markers.length ==1 ) {
      this.map.setCenter(this.markers[0].serviceObject.latLng);
    }
  };

  this.centerMapOnUser = function(){
    this.map.setCenter(this.userLocation);
  };

  this.addToMap = function(object){
    this.map.addShape(object);
  };

  this.removeFromMap = function(object){
    this.map.removeShape(object);
  }
}

Gmaps4RailsMapquest.prototype = new Gmaps4Rails();