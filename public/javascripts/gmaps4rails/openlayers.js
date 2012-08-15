(function() {

  Gmaps4Rails.Openlayers = {};

  Gmaps4Rails.Openlayers.Shared = {
    createPoint: function(lat, lng) {
      return new OpenLayers.Geometry.Point(lng, lat);
    },
    createLatLng: function(lat, lng) {
      return new OpenLayers.LonLat(lng, lat).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
    },
    createAnchor: function(offset) {
      if (offset === null) return null;
      return new OpenLayers.Pixel(offset[0], offset[1]);
    },
    createSize: function(width, height) {
      return new OpenLayers.Size(width, height);
    },
    createLatLngBounds: function() {
      return new OpenLayers.Bounds();
    }
  };

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Openlayers.Map = (function(_super) {

    __extends(Map, _super);

    Map.include(Gmaps4Rails.Interfaces.Map);

    Map.include(Gmaps4Rails.Map);

    Map.include(Gmaps4Rails.Openlayers.Shared);

    Map.include(Gmaps4Rails.Configuration);

    Map.prototype.CONF = {
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      type: "ROADMAP",
      mapTypeControl: null
    };

    function Map(map_options, controller) {
      var defaultOptions, mergedOpenlayersOptions, openlayersOptions;
      this.controller = controller;
      defaultOptions = this.setConf();
      this.options = this.mergeObjects(map_options, defaultOptions);
      openlayersOptions = {
        center: this.createLatLng(this.options.center_latitude, this.options.center_longitude),
        zoom: this.options.zoom
      };
      mergedOpenlayersOptions = this.mergeObjects(map_options.raw, openlayersOptions);
      this.serviceObject = new OpenLayers.Map(this.options.id, mergedOpenlayersOptions);
      this.serviceObject.addLayer(new OpenLayers.Layer.OSM());
    }

    Map.prototype.extendBoundsWithMarker = function(marker) {
      return this.boundsObject.extend(this.createLatLng(marker.lat, marker.lng));
    };

    Map.prototype.extendBoundsWithPolyline = function(polyline) {};

    Map.prototype.extendBoundsWithPolygon = function(polygon) {};

    Map.prototype.extendBoundsWithCircle = function(circle) {};

    Map.prototype.extendBound = function(bound) {};

    Map.prototype.fitBounds = function() {
      return this.serviceObject.zoomToExtent(this.boundsObject, true);
    };

    Map.prototype.adaptToBounds = function() {
      return this.fitBounds();
    };

    Map.prototype.centerMapOnUser = function(position) {
      return this.serviceObject.setCenter(position);
    };

    return Map;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Openlayers.Marker = (function(_super) {

    __extends(Marker, _super);

    Marker.include(Gmaps4Rails.Interfaces.Marker);

    Marker.include(Gmaps4Rails.Openlayers.Shared);

    Marker.include(Gmaps4Rails.Marker.Instance);

    Marker.extend(Gmaps4Rails.Marker.Class);

    Marker.extend(Gmaps4Rails.Configuration);

    function Marker(args, controller) {
      this.controller = controller;
      this.controller._createMarkersLayer();
      this._createMarkerStyle(args);
      if (this._isBasicMarker(args)) {
        this._styleForBasicMarker(args);
      } else {
        this._styleForCustomMarker(args);
      }
      this.serviceObject = new OpenLayers.Feature.Vector(this.createPoint(args.lat, args.lng), null, this.style_mark);
      this.serviceObject.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
      this.controller.markersLayer.addFeatures([this.serviceObject]);
    }

    Marker.prototype.createInfoWindow = function() {
      if (this.description != null) {
        return this.serviceObject.infoWindow = this.description;
      }
    };

    Marker.prototype.isVisible = function() {
      return true;
    };

    Marker.prototype._isBasicMarker = function(args) {
      return !(args.marker_picture != null);
    };

    Marker.prototype._createMarkerStyle = function(args) {
      this.style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
      this.style_mark.fillOpacity = 1;
      return this.style_mark.graphicTitle = args.title;
    };

    Marker.prototype._styleForBasicMarker = function(args) {
      this.style_mark.graphicHeight = 30;
      return this.style_mark.externalGraphic = "http://openlayers.org/dev/img/marker-blue.png";
    };

    Marker.prototype._styleForCustomMarker = function(args) {
      this.style_mark.graphicWidth = args.marker_width;
      this.style_mark.graphicHeight = args.marker_height;
      this.style_mark.externalGraphic = args.marker_picture;
      if (args.marker_anchor != null) {
        this.style_mark.graphicXOffset = args.marker_anchor[0];
        this.style_mark.graphicYOffset = args.marker_anchor[1];
      }
      if (args.shadow_picture != null) {
        this.style_mark.backgroundGraphic = args.shadow_picture;
        this.style_mark.backgroundWidth = args.shadow_width;
        this.style_mark.backgroundHeight = args.shadow_height;
        if (args.shadow_anchor != null) {
          this.style_mark.backgroundXOffset = args.shadow_anchor[0];
          return this.style_mark.backgroundYOffset = args.shadow_anchor[1];
        }
      }
    };

    return Marker;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Openlayers.Polyline = (function(_super) {

    __extends(Polyline, _super);

    Polyline.include(Gmaps4Rails.Openlayers.Shared);

    Polyline.extend(Gmaps4Rails.Polyline.Class);

    Polyline.extend(Gmaps4Rails.Configuration);

    function Polyline(polyline, controller) {
      var clickable, element, latlng, line_points, line_style, polyline_coordinates, strokeColor, strokeOpacity, strokeWeight, zIndex, _i, _len;
      this.controller = controller;
      this.controller._createPolylinesLayer();
      polyline_coordinates = [];
      for (_i = 0, _len = polyline.length; _i < _len; _i++) {
        element = polyline[_i];
        if (element === polyline[0]) {
          strokeColor = element.strokeColor || this.controller.polylines_conf.strokeColor;
          strokeOpacity = element.strokeOpacity || this.controller.polylines_conf.strokeOpacity;
          strokeWeight = element.strokeWeight || this.controller.polylines_conf.strokeWeight;
          clickable = element.clickable || this.controller.polylines_conf.clickable;
          zIndex = element.zIndex || this.controller.polylines_conf.zIndex;
        }
        if ((element.lat != null) && (element.lng != null)) {
          latlng = new OpenLayers.Geometry.Point(element.lng, element.lat);
          polyline_coordinates.push(latlng);
        }
      }
      line_points = new OpenLayers.Geometry.LineString(polyline_coordinates);
      line_style = {
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWidth: strokeWeight
      };
      this.serviceObject = new OpenLayers.Feature.Vector(line_points, null, line_style);
      this.serviceObject.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
      this.controller.polylinesLayer.addFeatures([this.serviceObject]);
    }

    Polyline.prototype.isVisible = function() {
      return true;
    };

    return Polyline;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsOpenlayers = (function(_super) {

    __extends(Gmaps4RailsOpenlayers, _super);

    Gmaps4RailsOpenlayers.include(Gmaps4Rails.Openlayers.Shared);

    function Gmaps4RailsOpenlayers() {
      Gmaps4RailsOpenlayers.__super__.constructor.apply(this, arguments);
      this.markersControl = null;
      this.markersLayer = null;
      this.polylinesLayer = null;
    }

    Gmaps4RailsOpenlayers.prototype.getModule = function() {
      return Gmaps4Rails.Openlayers;
    };

    Gmaps4RailsOpenlayers.prototype.createClusterer = function(marker_serviceObject_array) {
      var strategy, style;
      style = new OpenLayers.Style(this._clustererOptions, this._clustererFunctions);
      strategy = new OpenLayers.Strategy.Cluster;
      this._clearMarkersLayer();
      this.clusterLayer = new OpenLayers.Layer.Vector("Clusters", {
        strategies: [strategy],
        styleMap: new OpenLayers.StyleMap({
          "default": style,
          "select": {
            fillColor: "#8aeeef",
            strokeColor: "#32a8a9"
          }
        })
      });
      this.getMapObject().addLayer(this.clusterLayer);
      this.clusterLayer.addFeatures(marker_serviceObject_array);
      return this.clusterLayer;
    };

    Gmaps4RailsOpenlayers.prototype.clearClusterer = function() {
      if ((this.clusterLayer != null) && (this.getMapObject().getLayer(this.clusterLayer.id) != null)) {
        this.getMapObject().removeLayer(this.markerClusterer);
      }
      return this.clusterLayer = null;
    };

    Gmaps4RailsOpenlayers.prototype.clearMarkers = function() {
      this._clearMarkersLayer();
      this.clearClusterer();
      return this.markers = [];
    };

    Gmaps4RailsOpenlayers.prototype._createPolylinesLayer = function() {
      if (this.polylinesLayer != null) return;
      this.polylinesLayer = new OpenLayers.Layer.Vector("Polylines", null);
      this.polylinesLayer.events.register("featureselected", this.polylinesLayer, this._onFeatureSelect);
      this.polylinesLayer.events.register("featureunselected", this.polylinesLayer, this._onFeatureUnselect);
      this.polylinesControl = new OpenLayers.Control.DrawFeature(this.polylinesLayer, OpenLayers.Handler.Path);
      this.getMapObject().addLayer(this.polylinesLayer);
      return this.getMapObject().addControl(this.polylinesControl);
    };

    Gmaps4RailsOpenlayers.prototype._createMarkersLayer = function() {
      if (this.markersLayer != null) return;
      this.markersLayer = new OpenLayers.Layer.Vector("Markers", null);
      this.getMapObject().addLayer(this.markersLayer);
      this.markersLayer.events.register("featureselected", this.markersLayer, this._onFeatureSelect());
      this.markersLayer.events.register("featureunselected", this.markersLayer, this._onFeatureUnselect());
      this.markersControl = new OpenLayers.Control.SelectFeature(this.markersLayer);
      this.getMapObject().addControl(this.markersControl);
      return this.markersControl.activate();
    };

    Gmaps4RailsOpenlayers.prototype._clearMarkersLayer = function() {
      if ((this.markersLayer != null) && (this.getMapObject().getLayer(this.markersLayer.id) != null)) {
        this.getMapObject().removeLayer(this.markersLayer);
      }
      return this.markersLayer = null;
    };

    Gmaps4RailsOpenlayers.prototype._onFeatureSelect = function() {
      var controller;
      controller = this;
      return function(evt) {
        var feature, popup;
        feature = evt.feature;
        popup = new OpenLayers.Popup.FramedCloud("featurePopup", feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(300, 200), feature.infoWindow, null, true, controller._onPopupClose(controller, feature));
        feature.popup = popup;
        popup.feature = feature;
        return controller.getMapObject().addPopup(popup);
      };
    };

    Gmaps4RailsOpenlayers.prototype._onFeatureUnselect = function() {
      var controller;
      controller = this;
      return function(evt) {
        var feature;
        feature = evt.feature;
        if (feature.popup != null) {
          controller.getMapObject().removePopup(feature.popup);
          feature.popup.destroy();
          return feature.popup = null;
        }
      };
    };

    Gmaps4RailsOpenlayers.prototype._onPopupClose = function(controller, feature) {
      return function() {
        return controller.markersControl.unselect(feature);
      };
    };

    Gmaps4RailsOpenlayers.prototype._clustererFunctions = {
      context: {
        width: function(feature) {
          var _ref;
          return (_ref = feature.cluster) != null ? _ref : {
            2: 1
          };
        },
        radius: function(feature) {
          var pix;
          pix = 2;
          if (feature.cluster) pix = feature.cluster.length + 10;
          return pix;
        },
        label: function(feature) {
          if (feature.cluster) {
            return feature.cluster.length;
          } else {
            return "";
          }
        }
      }
    };

    Gmaps4RailsOpenlayers.prototype._clustererOptions = {
      pointRadius: "${radius}",
      fillColor: "#ffcc66",
      fillOpacity: 0.8,
      strokeColor: "#cc6633",
      strokeWidth: "${width}",
      label: "${label}"
    };

    return Gmaps4RailsOpenlayers;

  })(Gmaps4Rails.BaseController);

}).call(this);