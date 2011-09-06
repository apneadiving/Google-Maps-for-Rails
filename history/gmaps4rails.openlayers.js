var Gmaps4RailsOpenlayers = function() {

  ////////////////////////////////////////////////////
  /////////////// Abstracting API calls //////////////
  //(for maybe an extension to another map provider)//
  //////////////////mocks created/////////////////////
  // http://wiki.openstreetmap.org/wiki/OpenLayers
  // http://openlayers.org/dev/examples
  //http://docs.openlayers.org/contents.html
  this.map_options = {};
  this.mergeWithDefault("map_options");
  this.markers_conf = {};
  this.mergeWithDefault("markers_conf");
  
  this.openMarkers = null;
  this.markersLayer = null;
  this.markersControl = null;

  ////////////////////////////////////////////////////
  /////////////// Basic Objects   ////////////////////
  ////////////////////////////////////////////////////

  this.createPoint = function(lat, lng){
    //return new Microsoft.Maps.Point(lat, lng);
  };

  this.createLatLng = function(lat, lng){
    return new OpenLayers.LonLat(lng, lat)
              .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
              );
  };

  this.createAnchor = function(offset){
    if (offset === null)
      { return null; }
    else {
     return new OpenLayers.Pixel(offset[0], offset[1]);
    }
  };

  this.createSize = function(width, height){
    return new OpenLayers.Size(width, height);
  };

  this.createLatLngBounds = function(){
     return new OpenLayers.Bounds();
  };

  this.createMap = function(){
    //todo add customization: kind of map and other map options
    var map = new OpenLayers.Map(this.map_options.id);
    map.addLayer(new OpenLayers.Layer.OSM());
    map.setCenter(this.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude), // Center of the map
                  this.map_options.zoom // Zoom level
                 );  
    return map;
  };

  ////////////////////////////////////////////////////
  ////////////////////// Markers /////////////////////
  ////////////////////////////////////////////////////
  //http://openlayers.org/dev/examples/marker-shadow.html
   this.createMarker = function(args){
   
     var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
     style_mark.fillOpacity = 1;
   
     //creating markers' dedicated layer 
     if (this.markersLayer === null) {
        this.markersLayer = new OpenLayers.Layer.Vector("Markers", null);
        this.map.addLayer(this.markersLayer);
        //TODO move?
        this.markersLayer.events.register("featureselected", this.markersLayer, this.onFeatureSelect);
        this.markersLayer.events.register("featureunselected", this.markersLayer, this.onFeatureUnselect);
      
        this.markersControl = new OpenLayers.Control.SelectFeature(this.markersLayer);
        this.map.addControl(this.markersControl);
        this.markersControl.activate();
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
     this.markersLayer.addFeatures([marker]);
  
     return marker;
  };

  // clear markers
  this.clearMarkers = function() {
    this.clearMarkersLayerIfExists();
    this.markersLayer = null;
    this.boundsObject = new OpenLayers.Bounds();
  };

  this.clearMarkersLayerIfExists = function() {
    if (this.markersLayer !== null) {
      if (this.map.getLayer(this.markersLayer.id) !== null) {
        this.map.removeLayer(this.markersLayer); 
      }
    }
  };

  this.extendBoundsWithMarkers = function(){
    for (var i = 0; i <  this.markers.length; ++i) {
      this.boundsObject.extend(this.createLatLng(this.markers[i].lat,this.markers[i].lng));        
    } 
  };
  ////////////////////////////////////////////////////
  /////////////////// Clusterer //////////////////////
  ////////////////////////////////////////////////////
  //too ugly to be considered valid :(

  this.createClusterer = function(markers_array){

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
        this.clearMarkersLayerIfExists();
        this.map.addLayer(clusters);
        clusters.addFeatures(markers_array);
        return clusters;
  };

  this.clusterize = function() {
  
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
  
      this.markerClusterer = this.createClusterer(markers_array);
    }
  
  };

  this.clearClusterer = function() {
    this.map.removeLayer(this.markerClusterer);
  };

  ////////////////////////////////////////////////////
  /////////////////// INFO WINDOW ////////////////////
  ////////////////////////////////////////////////////

  // creates infowindows
  this.createInfoWindow = function(marker_container){
    var info_window;
    if (this.exists(marker_container.description)) {
      marker_container.serviceObject.infoWindow = marker_container.description;
    }
  };

  this.onPopupClose = function(evt) {
      // 'this' is the popup.
      this.markersControl.unselect(this.feature);
  };

  this.onFeatureSelect = function(evt) {
      var feature = evt.feature;    
      var popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                               feature.geometry.getBounds().getCenterLonLat(),
                               new OpenLayers.Size(300,200),
                               feature.infoWindow,
                               null, true, this.onPopupClose);
      feature.popup = popup;
      popup.feature = feature;
      this.map.addPopup(popup);
  };

  this.onFeatureUnselect = function(evt) {
      var feature = evt.feature;
      if (feature.popup) {
          //popup.feature = null;
          this.map.removePopup(feature.popup);
          feature.popup.destroy();
          feature.popup = null;
      }
  };

  ////////////////////////////////////////////////////
  /////////////////// Other methods //////////////////
  ////////////////////////////////////////////////////

  this.fitBounds = function(){
    this.map.zoomToExtent(this.boundsObject, true);
  };

  this.centerMapOnUser = function(){
    this.map.setCenter(this.userLocation);
  };
};

Gmaps4RailsOpenlayers.prototype = new Gmaps4Rails();