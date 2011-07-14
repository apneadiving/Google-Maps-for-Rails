////////////////////////////////////////////////////
/////////////// Abstracting API calls //////////////
//(for maybe an extension to another map provider)//
//////////////////mocks created/////////////////////
// http://wiki.openstreetmap.org/wiki/OpenLayers
// http://openlayers.org/dev/examples
//http://docs.openlayers.org/contents.html

Gmaps4Rails.openMarkers = null;
Gmaps4Rails.markersLayer = null;
Gmaps4Rails.markersControl = null;

////////////////////////////////////////////////////
/////////////// Basic Objects   ////////////////////
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
   
   var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
   style_mark.fillOpacity = 1;
   
   //creating markers' dedicated layer 
   if (Gmaps4Rails.markersLayer === null) {
      Gmaps4Rails.markersLayer = new OpenLayers.Layer.Vector("Markers", null);
      Gmaps4Rails.map.addLayer(Gmaps4Rails.markersLayer);
      //TODO move?
      Gmaps4Rails.markersLayer.events.register("featureselected", Gmaps4Rails.markersLayer, Gmaps4Rails.onFeatureSelect);
      Gmaps4Rails.markersLayer.events.register("featureunselected", Gmaps4Rails.markersLayer, Gmaps4Rails.onFeatureUnselect);
      
      Gmaps4Rails.markersControl = new OpenLayers.Control.SelectFeature(Gmaps4Rails.markersLayer);
      Gmaps4Rails.map.addControl(Gmaps4Rails.markersControl);
      Gmaps4Rails.markersControl.activate();
    }
    //showing default pic if none available
    if (args.marker_picture === "" ) { 
       //style_mark.graphicWidth = 24;
       style_mark.graphicHeight = 30;
       style_mark.externalGraphic = "http://openlayers.org/dev/img/marker-blue.png";
    } 
    //creating custom pic
    else {
      style_mark.graphicWidth  = args.marker_width;
      style_mark.graphicHeight = args.marker_height;
      style_mark.externalGraphic = args.marker_picture;
      //adding anchor if any
      if (args.marker_anchor !== null ){
        style_mark.graphicXOffset = args.marker_anchor[0];
        style_mark.graphicYOffset = args.marker_anchor[1];
      }
      //adding shadow if any
      if (args.shadow_picture !== ""){
        style_mark.backgroundGraphic = args.shadow_picture;
        style_mark.backgroundWidth  = args.shadow_width;
        style_mark.backgroundHeight = args.shadow_height;
        //adding shadow's anchor if any
        if(args.shadow_anchor !== null) {
          style_mark.backgroundXOffset = args.shadow_anchor[0];
          style_mark.backgroundYOffset = args.shadow_anchor[1];
        }
      }
    }

   style_mark.graphicTitle = args.title;
  
   var marker = new OpenLayers.Feature.Vector(
          new OpenLayers.Geometry.Point(args.Lng, args.Lat),
          null,
          style_mark
      );
   //changing coordinates so that it actually appears on the map!
   marker.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
   //adding layer to the map
   Gmaps4Rails.markersLayer.addFeatures([marker]);
  
   return marker;
};

// clear markers
Gmaps4Rails.clearMarkers = function() {
  Gmaps4Rails.clearMarkersLayerIfExists();
  Gmaps4Rails.markersLayer = null;
  Gmaps4Rails.boundsObject = new OpenLayers.Bounds();
};

Gmaps4Rails.clearMarkersLayerIfExists = function() {
  if (Gmaps4Rails.markersLayer !== null) {
    if (Gmaps4Rails.map.getLayer(Gmaps4Rails.markersLayer.id) !== null) {
      Gmaps4Rails.map.removeLayer(Gmaps4Rails.markersLayer); 
    }
  }
};

Gmaps4Rails.extendBoundsWithMarkers = function(){
  for (var i = 0; i <  this.markers.length; ++i) {
    Gmaps4Rails.boundsObject.extend(Gmaps4Rails.createLatLng(Gmaps4Rails.markers[i].lat,Gmaps4Rails.markers[i].lng));        
  } 
};
////////////////////////////////////////////////////
/////////////////// Clusterer //////////////////////
////////////////////////////////////////////////////
//too ugly to be considered valid :(

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
      Gmaps4Rails.clearMarkersLayerIfExists();
      Gmaps4Rails.map.addLayer(clusters);
      clusters.addFeatures(markers_array);
      return clusters;
};

Gmaps4Rails.clusterize = function() {
  
  if (this.markers_conf.do_clustering === true)
  {
    //first clear the existing clusterer if any
    if (this.markerClusterer !== null) {
      this.clearClusterer();
    }
  
    var markers_array = new Array;
    for (var i = 0; i <  this.markers.length; ++i) {
      markers_array.push(this.markers[i].serviceObject);
    }
  
    this.markerClusterer = Gmaps4Rails.createClusterer(markers_array);
  }
  
};

Gmaps4Rails.clearClusterer = function() {
  Gmaps4Rails.map.removeLayer(Gmaps4Rails.markerClusterer);
};

////////////////////////////////////////////////////
/////////////////// INFO WINDOW ////////////////////
////////////////////////////////////////////////////

// creates infowindows
Gmaps4Rails.createInfoWindow = function(marker_container){
  var info_window;
  if (Gmaps4Rails.exists(marker_container.description)) {
    marker_container.serviceObject.infoWindow = marker_container.description;
  }
};

Gmaps4Rails.onPopupClose = function(evt) {
    // 'this' is the popup.
    Gmaps4Rails.markersControl.unselect(this.feature);
};

Gmaps4Rails.onFeatureSelect = function(evt) {
    var feature = evt.feature;    
    var popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                             feature.geometry.getBounds().getCenterLonLat(),
                             new OpenLayers.Size(300,200),
                             feature.infoWindow,
                             null, true, Gmaps4Rails.onPopupClose);
    feature.popup = popup;
    popup.feature = feature;
    Gmaps4Rails.map.addPopup(popup);
};

Gmaps4Rails.onFeatureUnselect = function(evt) {
    var feature = evt.feature;
    if (feature.popup) {
        //popup.feature = null;
        Gmaps4Rails.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
};

////////////////////////////////////////////////////
/////////////////// Other methods //////////////////
////////////////////////////////////////////////////

Gmaps4Rails.fitBounds = function(){
  Gmaps4Rails.map.zoomToExtent(Gmaps4Rails.boundsObject, true);
};

Gmaps4Rails.centerMapOnUser = function(){
  Gmaps4Rails.map.setCenter(Gmaps4Rails.userLocation);
};