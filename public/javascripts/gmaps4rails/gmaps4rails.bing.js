var Gmaps4RailsBing = function() {

  this.map_options = {
    type:  "road"      // aerial, auto, birdseye, collinsBart, mercator, ordnanceSurvey, road
  };             
  this.markers_conf = {
    infobox:  "description"  // description or htmlContent
  };

  this.mergeWithDefault("map_options");
  this.mergeWithDefault("markers_conf");
  
  ////////////////////////////////////////////////////
  /////////////// Basic Objects         //////////////
  ////////////////////////////////////////////////////

  this.getMapType = function(){
    switch(this.map_options.type)
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

  this.createPoint = function(lat, lng){
    return new Microsoft.Maps.Point(lat, lng);
  };

  this.createLatLng = function(lat, lng){
    return new Microsoft.Maps.Location(lat, lng);
  };

  this.createLatLngBounds = function(){

  };

  this.createMap = function(){
    return new Microsoft.Maps.Map(document.getElementById(this.map_options.id), { 
      credentials:  this.map_options.provider_key,
      mapTypeId:    this.getMapType(),
      center:       this.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude),
      zoom:         this.map_options.zoom
   });
  };

  this.createSize = function(width, height){
    return new google.maps.Size(width, height);
  };

  ////////////////////////////////////////////////////
  ////////////////////// Markers /////////////////////
  ////////////////////////////////////////////////////

  this.createMarker = function(args){
    var markerLatLng = this.createLatLng(args.Lat, args.Lng); 
    var marker;
    // Marker sizes are expressed as a Size of X,Y
    if (args.marker_picture === "" ) { 
      marker = new Microsoft.Maps.Pushpin(this.createLatLng(args.Lat, args.Lng), {
       draggable: args.marker_draggable,
       anchor:    this.createImageAnchorPosition(args.Lat, args.Lng),
       text:      args.marker_title
       }
      );
    } else {
      marker = new Microsoft.Maps.Pushpin(this.createLatLng(args.Lat, args.Lng), {
       draggable: args.marker_draggable,
       anchor:    this.createImageAnchorPosition(args.Lat, args.Lng),
       icon:      args.marker_picture,
       height:    args.marker_height,
       text:      args.marker_title,
       width:     args.marker_width
       }
      );
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

  this.clearMarker = function(marker) {
    this.removeFromMap(marker.serviceObject);
  };

  //show and hide markers
  this.showMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.showMarker(this.markers[i]);
    }
  };

  this.showMarker = function(marker) {
    marker.serviceObject.setOptions({ visible: true });
  };

  this.hideMarkers = function() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.hideMarker(this.markers[i]);
    }
  };

  this.hideMarker = function(marker) {
    marker.serviceObject.setOptions({ visible: false });
  };

  this.extendBoundsWithMarkers = function(){
    var locationsArray = [];
    for (var i = 0; i <  this.markers.length; ++i) {
      locationsArray.push(this.markers[i].serviceObject.getLocation());        
    } 
    this.boundsObject = Microsoft.Maps.LocationRect.fromLocations(locationsArray);
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
    var info_window;
    if (this.exists(marker_container.description)) {
      //create the infowindow
      if (this.markers_conf.infobox === "description") {
        marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), { description: marker_container.description, visible: false, showCloseButton: true});  
      }
      else {
        marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), { htmlContent: marker_container.description, visible: false});
      }
                                     
      //add the listener associated
      Microsoft.Maps.Events.addHandler(marker_container.serviceObject, 'click', this.openInfoWindow(marker_container.info_window));
      this.addToMap(marker_container.info_window);
    }
  };

  this.openInfoWindow = function(infoWindow) {
    return function() {
        // Close the latest selected marker before opening the current one.
        if (this.visibleInfoWindow) {
          this.visibleInfoWindow.setOptions({ visible: false });
        }
        infoWindow.setOptions({ visible:true });
        this.visibleInfoWindow = infoWindow;
      };
  };

  ////////////////////////////////////////////////////
  /////////////////// Other methods //////////////////
  ////////////////////////////////////////////////////

  this.fitBounds = function(){
    this.map.setView({bounds: this.boundsObject});
  };

  this.addToMap = function(object){
    this.map.entities.push(object);
  };

  this.removeFromMap = function(object){
    this.map.entities.remove(object);
  };

  this.centerMapOnUser = function(){
    this.map.setView({ center: this.userLocation});
  };
};

Gmaps4RailsBing.prototype = new Gmaps4Rails();