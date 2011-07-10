////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////
// http://wiki.openstreetmap.org/wiki/OpenLayers
// http://openlayers.org/dev/examples

Gmaps4Rails.openMarkers = null;
Gmaps4Rails.markersLayer = null;

////////////////////////////////////////////////////
/////////////// Basic Objects         //////////////
////////////////////////////////////////////////////

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

Gmaps4Rails.createAnchor = function(offset){
  if (offset === null)
    { return null; }
  else {
   return new OpenLayers.Pixel(offset[0], offset[1]);
  }
};

Gmaps4Rails.createSize = function(width, height){
  return new OpenLayers.Size(width, height);
};

Gmaps4Rails.createLatLngBounds = function(){
   return new OpenLayers.Bounds();
};

Gmaps4Rails.createMap = function(){
  //todo add customization: kind of map and other map options
  var map = new OpenLayers.Map(Gmaps4Rails.map_options.id);
  map.addLayer(new OpenLayers.Layer.OSM());
  map.setCenter(Gmaps4Rails.createLatLng(Gmaps4Rails.map_options.center_latitude, Gmaps4Rails.map_options.center_longitude), // Center of the map
                Gmaps4Rails.map_options.zoom // Zoom level
               );  
  return map;
};

////////////////////////////////////////////////////
////////////////////// Markers /////////////////////
////////////////////////////////////////////////////
//http://openlayers.org/dev/examples/marker-shadow.html
 Gmaps4Rails.createMarker = function(args){
   if (Gmaps4Rails.markersLayer === null) {
      Gmaps4Rails.markersLayer = new OpenLayers.Layer.Vector("Markers", null);
  Gmaps4Rails.map.setCenter(Gmaps4Rails.createLatLng(args.Lng, args.Lat), 5);
  Gmaps4Rails.map.addLayer(Gmaps4Rails.markersLayer);
  }
  
  var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
              // each of the three lines below means the same, if only one of
              // them is active: the image will have a size of 24px, and the
              // aspect ratio will be kept
              // style_mark.pointRadius = 12;
              // style_mark.graphicHeight = 24; 
              // style_mark.graphicWidth = 24;

              // if graphicWidth and graphicHeight are both set, the aspect ratio
              // of the image will be ignored
              style_mark.graphicWidth = 24;
              style_mark.graphicHeight = 20;
              // style_mark.graphicXOffset = 10; // default is -(style_mark.graphicWidth/2);
              // style_mark.graphicYOffset = -style_mark.graphicHeight;
              style_mark.externalGraphic = "http://openlayers.org/dev/img/marker-blue.png";
              // graphicTitle only works in Firefox and Internet Explorer
              style_mark.graphicTitle = "this is a test tooltip";
  
  var marker = new OpenLayers.Feature.Vector(
          new OpenLayers.Geometry.Point(args.Lng, args.Lat),
          null,
          style_mark
      );
  
  Gmaps4Rails.markersLayer.addFeatures([marker]);
  
  return marker;
      
  // var marker;
  // if (Gmaps4Rails.openMarkers == null) {
  //   Gmaps4Rails.openMarkers = new OpenLayers.Layer.Markers("Markers");
  //   Gmaps4Rails.map.addLayer(Gmaps4Rails.openMarkers);
  // }
  // if (args.marker_picture === "" ) { 
  //   marker = new OpenLayers.Marker(Gmaps4Rails.createLatLng(args.Lat, args.Lng));
  // } else {
  //   var anchor = Gmaps4Rails.createAnchor(args.marker_anchor);
  //   var icon = new OpenLayers.Icon(args.marker_picture, Gmaps4Rails.createSize(args.marker_width, args.marker_height), anchor);
  //   marker   = new OpenLayers.Marker(Gmaps4Rails.createLatLng(args.Lat, args.Lng), icon);
  // }
  // 
  // Gmaps4Rails.openMarkers.addMarker(marker);
  // return marker;
};

// clear markers
Gmaps4Rails.clearMarkers = function() {
  layer.removeFeatures(layer.features);
  
  Gmaps4Rails.map.removeLayer(Gmaps4Rails.openMarkers);
  Gmaps4Rails.openMarkers = null;
  Gmaps4Rails.boundsObject = new OpenLayers.Bounds();
};


Gmaps4Rails.extendBoundsWithMarkers = function(){
  for (var i = 0; i <  this.markers.length; ++i) {
    Gmaps4Rails.boundsObject.extend(Gmaps4Rails.markers[i].serviceObject.lonlat);        
  } 
};
////////////////////////////////////////////////////
/////////////////// Clusterer //////////////////////
////////////////////////////////////////////////////

Gmaps4Rails.createClusterer = function(markers_array){

      var style = new OpenLayers.Style({
          pointRadius: "${radius}",
          fillColor: "#ffcc66",
          fillOpacity: 0.8,
          strokeColor: "#cc6633",
          strokeWidth: "${width}",
          strokeOpacity: 0.8
      }, {
          context: {
              width: function(feature) {
                  return (feature.cluster) ? 2 : 1;
              },
              radius: function(feature) {
                  var pix = 2;
                  if(feature.cluster) {
                      pix = Math.min(feature.attributes.count, 7) + 2;
                  }
                  return pix;
              }
          }
      });
      
      var strategy = new OpenLayers.Strategy.Cluster();

      var clusters = new OpenLayers.Layer.Vector("Clusters", {
          strategies: [strategy],
          styleMap: new OpenLayers.StyleMap({
              "default": style,
              "select": {
                  fillColor: "#8aeeef",
                  strokeColor: "#32a8a9"
              }
          })
      });
      
      Gmaps4Rails.map.addLayer(clusters);
      clusters.addFeatures(markers_array);
      return clusters;
};

Gmaps4Rails.clusterize = function() {
  
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
  // 
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


Gmaps4Rails.fitBounds = function(){
  Gmaps4Rails.map.zoomToExtent(Gmaps4Rails.boundsObject, true)
  //toBBOX();
};