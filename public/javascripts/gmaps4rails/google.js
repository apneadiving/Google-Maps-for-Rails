(function() {

  Gmaps4Rails.Google = {};

  Gmaps4Rails.Google.Shared = {
    createPoint: function(lat, lng) {
      return new google.maps.Point(lat, lng);
    },
    createSize: function(width, height) {
      return new google.maps.Size(width, height);
    },
    createLatLng: function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    },
    createLatLngBounds: function() {
      return new google.maps.LatLngBounds();
    },
    clear: function() {
      return this.serviceObject.setMap(null);
    },
    show: function() {
      return this.serviceObject.setVisible(true);
    },
    hide: function() {
      return this.serviceObject.setVisible(false);
    },
    isVisible: function() {
      return this.serviceObject.getVisible();
    }
  };

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Circle = (function(_super) {

    __extends(Circle, _super);

    Circle.include(Gmaps4Rails.Interfaces.Basic);

    Circle.include(Gmaps4Rails.Google.Shared);

    Circle.extend(Gmaps4Rails.Circle.Class);

    Circle.extend(Gmaps4Rails.Configuration);

    function Circle(circle, controller) {
      var circleOptions, mergedOptions;
      this.controller = controller;
      if (circle === this.controller.circles[0]) {
        if (circle.strokeColor != null) {
          this.controller.circles_conf.strokeColor = circle.strokeColor;
        }
        if (circle.strokeOpacity != null) {
          this.controller.circles_conf.strokeOpacity = circle.strokeOpacity;
        }
        if (circle.strokeWeight != null) {
          this.controller.circles_conf.strokeWeight = circle.strokeWeight;
        }
        if (circle.fillColor != null) {
          this.controller.circles_conf.fillColor = circle.fillColor;
        }
        if (circle.fillOpacity != null) {
          this.controller.circles_conf.fillOpacity = circle.fillOpacity;
        }
      }
      if ((circle.lat != null) && (circle.lng != null)) {
        circleOptions = {
          center: this.createLatLng(circle.lat, circle.lng),
          strokeColor: circle.strokeColor || this.controller.circles_conf.strokeColor,
          strokeOpacity: circle.strokeOpacity || this.controller.circles_conf.strokeOpacity,
          strokeWeight: circle.strokeWeight || this.controller.circles_conf.strokeWeight,
          fillOpacity: circle.fillOpacity || this.controller.circles_conf.fillOpacity,
          fillColor: circle.fillColor || this.controller.circles_conf.fillColor,
          clickable: circle.clickable || this.controller.circles_conf.clickable,
          zIndex: circle.zIndex || this.controller.circles_conf.zIndex,
          radius: circle.radius
        };
        mergedOptions = this.mergeObjects(this.controller.circles_conf.raw, circleOptions);
        this.serviceObject = new google.maps.Circle(mergedOptions);
        this.serviceObject.setMap(this.controller.getMapObject());
      }
    }

    return Circle;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Kml = (function(_super) {

    __extends(Kml, _super);

    Kml.include(Gmaps4Rails.Interfaces.Basic);

    Kml.include(Gmaps4Rails.Google.Shared);

    Kml.include(Gmaps4Rails.Kml.Instance);

    function Kml(kmlData, controller) {
      var kml;
      this.controller = controller;
      this.options = kmlData.options || {};
      this.options = this.mergeObjects(this.options, this.DEFAULT_CONF);
      kml = new google.maps.KmlLayer(kmlData.url, this.options);
      kml.setMap(this.controller.getMapObject());
      this.serviceObject = kml;
    }

    return Kml;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Gmaps4Rails.Google.Map = (function(_super) {

    __extends(Map, _super);

    Map.include(Gmaps4Rails.Interfaces.Map);

    Map.include(Gmaps4Rails.Map);

    Map.include(Gmaps4Rails.Google.Shared);

    Map.include(Gmaps4Rails.Configuration);

    Map.prototype.CONF = {
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      type: "ROADMAP",
      mapTypeControl: null
    };

    function Map(map_options, controller) {
      var defaultOptions, googleOptions, mergedGoogleOptions;
      this.controller = controller;
      defaultOptions = this.setConf();
      this.options = this.mergeObjects(map_options, defaultOptions);
      googleOptions = {
        maxZoom: this.options.maxZoom,
        minZoom: this.options.minZoom,
        zoom: this.options.zoom,
        center: this.createLatLng(this.options.center_latitude, this.options.center_longitude),
        mapTypeId: google.maps.MapTypeId[this.options.type],
        mapTypeControl: this.options.mapTypeControl,
        disableDefaultUI: this.options.disableDefaultUI,
        disableDoubleClickZoom: this.options.disableDoubleClickZoom,
        draggable: this.options.draggable
      };
      mergedGoogleOptions = this.mergeObjects(map_options.raw, googleOptions);
      this.serviceObject = new google.maps.Map(document.getElementById(this.options.id), mergedGoogleOptions);
    }

    Map.prototype.extendBoundsWithMarker = function(marker) {
      return this.boundsObject.extend(marker.serviceObject.position);
    };

    Map.prototype.extendBoundsWithPolyline = function(polyline) {
      var point, polyline_points, _i, _len, _results;
      polyline_points = polyline.serviceObject.latLngs.getArray()[0].getArray();
      _results = [];
      for (_i = 0, _len = polyline_points.length; _i < _len; _i++) {
        point = polyline_points[_i];
        _results.push(this.boundsObject.extend(point));
      }
      return _results;
    };

    Map.prototype.extendBoundsWithPolygon = function(polygon) {
      var point, polygon_points, _i, _len, _results;
      polygon_points = polygon.serviceObject.latLngs.getArray()[0].getArray();
      _results = [];
      for (_i = 0, _len = polygon_points.length; _i < _len; _i++) {
        point = polygon_points[_i];
        _results.push(this.boundsObject.extend(point));
      }
      return _results;
    };

    Map.prototype.extendBoundsWithCircle = function(circle) {
      this.boundsObject.extend(circle.serviceObject.getBounds().getNorthEast());
      return this.boundsObject.extend(circle.serviceObject.getBounds().getSouthWest());
    };

    Map.prototype.extendBound = function(bound) {
      return this.boundsObject.extend(this.createLatLng(bound.lat, bound.lng));
    };

    Map.prototype.adaptToBounds = function() {
      var map_center;
      if (!this.options.auto_zoom) {
        map_center = this.boundsObject.getCenter();
        this.options.center_latitude = map_center.lat();
        this.options.center_longitude = map_center.lng();
        return this.serviceObject.setCenter(map_center);
      } else {
        return this.fitBounds();
      }
    };

    Map.prototype.fitBounds = function() {
      if (!this.boundsObject.isEmpty()) {
        return this.serviceObject.fitBounds(this.boundsObject);
      }
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

  Gmaps4Rails.Google.Marker = (function(_super) {
    var CONF;

    __extends(Marker, _super);

    Marker.include(Gmaps4Rails.Interfaces.Marker);

    Marker.include(Gmaps4Rails.Google.Shared);

    Marker.include(Gmaps4Rails.Marker.Instance);

    Marker.extend(Gmaps4Rails.Marker.Class);

    Marker.extend(Gmaps4Rails.Configuration);

    CONF = {
      clusterer_gridSize: 50,
      clusterer_maxZoom: 5,
      custom_cluster_pictures: null,
      custom_infowindow_class: null,
      raw: {}
    };

    function Marker(args, controller) {
      var markerLatLng;
      this.controller = controller;
      markerLatLng = this.createLatLng(args.lat, args.lng);
      if (this._isBasicMarker(args)) {
        this._createBasicMarker(markerLatLng, args);
      } else {
        if (args.rich_marker != null) {
          this._createRichMarker(markerLatLng, args);
        } else {
          this._createMarker(markerLatLng, args);
        }
      }
    }

    Marker.prototype.createInfoWindow = function() {
      var boxText;
      if (typeof this.controller.jsTemplate === "function" || (this.description != null)) {
        if (typeof this.controller.jsTemplate === "function") {
          this.description = this.controller.jsTemplate(this);
        }
        if (CONF.custom_infowindow_class != null) {
          boxText = document.createElement("div");
          boxText.setAttribute("class", CONF.custom_infowindow_class);
          boxText.innerHTML = this.description;
          this.infowindow = new InfoBox(this.infobox(boxText));
          return google.maps.event.addListener(this.serviceObject, 'click', this._openInfowindow());
        } else {
          this.infowindow = new google.maps.InfoWindow({
            content: this.description
          });
          return google.maps.event.addListener(this.serviceObject, 'click', this._openInfowindow());
        }
      }
    };

    Marker.prototype._createBasicMarker = function(markerLatLng, args) {
      var defaultOptions, mergedOptions;
      defaultOptions = {
        position: markerLatLng,
        map: this.getMap(),
        title: args.marker_title,
        draggable: args.marker_draggable,
        zIndex: args.zindex
      };
      mergedOptions = this.mergeObjects(CONF.raw, defaultOptions);
      return this.serviceObject = new google.maps.Marker(defaultOptions);
    };

    Marker.prototype._createRichMarker = function(markerLatLng, args) {
      return new RichMarker({
        position: markerLatLng,
        map: this.serviceObject,
        draggable: args.marker_draggable,
        content: args.rich_marker,
        flat: args.marker_anchor === null ? false : args.marker_anchor[1],
        anchor: args.marker_anchor === null ? 0 : args.marker_anchor[0],
        zIndex: args.zindex
      });
    };

    Marker.prototype._createMarker = function(markerLatLng, args) {
      var defaultOptions, imageAnchorPosition, markerImage, mergedOptions, shadowAnchorPosition, shadowImage;
      imageAnchorPosition = this._createImageAnchorPosition(args.marker_anchor);
      shadowAnchorPosition = this._createImageAnchorPosition(args.shadow_anchor);
      markerImage = this._createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition);
      shadowImage = this._createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition);
      defaultOptions = {
        position: markerLatLng,
        map: this.getMap(),
        icon: markerImage,
        title: args.marker_title,
        draggable: args.marker_draggable,
        shadow: shadowImage,
        zIndex: args.zindex
      };
      mergedOptions = this.mergeObjects(CONF.raw, defaultOptions);
      return this.serviceObject = new google.maps.Marker(mergedOptions);
    };

    Marker.prototype._includeMarkerImage = function(obj) {
      var index, object, _len, _ref;
      _ref = this.controller.markerImages;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        object = _ref[index];
        if (object.url === obj) return index;
      }
      return false;
    };

    Marker.prototype._createOrRetrieveImage = function(currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition) {
      var markerImage, test_image_index;
      if (typeof currentMarkerPicture === "undefined" || currentMarkerPicture === "" || currentMarkerPicture === null) {
        return null;
      }
      if (!(test_image_index = this._includeMarkerImage(currentMarkerPicture))) {
        markerImage = this._createMarkerImage(currentMarkerPicture, this.createSize(markerWidth, markerHeight), null, imageAnchorPosition, null);
        this.controller.markerImages.push(markerImage);
        return markerImage;
      } else {
        if (typeof test_image_index === 'number') {
          return this.controller.markerImages[test_image_index];
        }
        return false;
      }
    };

    Marker.prototype._isBasicMarker = function(args) {
      return !(args.marker_picture != null) && !(args.rich_marker != null);
    };

    Marker.prototype._createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
      return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
    };

    Marker.prototype._createImageAnchorPosition = function(anchorLocation) {
      if (anchorLocation === null) {
        return null;
      } else {
        return this.createPoint(anchorLocation[0], anchorLocation[1]);
      }
    };

    Marker.prototype._openInfowindow = function() {
      var that;
      that = this;
      return function() {
        that.controller._closeVisibleInfoWindow();
        that.infowindow.open(that.getMap(), that.serviceObject);
        return that.controller._setVisibleInfoWindow(that.infowindow);
      };
    };

    return Marker;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Polygon = (function(_super) {

    __extends(Polygon, _super);

    Polygon.include(Gmaps4Rails.Interfaces.Basic);

    Polygon.include(Gmaps4Rails.Google.Shared);

    Polygon.extend(Gmaps4Rails.Polygon.Class);

    Polygon.extend(Gmaps4Rails.Configuration);

    function Polygon(polygon, controller) {
      var clickable, fillColor, fillOpacity, latlng, mergedOptions, point, polyOptions, polygon_coordinates, strokeColor, strokeOpacity, strokeWeight, _i, _len;
      this.controller = controller;
      polygon_coordinates = [];
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        point = polygon[_i];
        latlng = this.createLatLng(point.lat, point.lng);
        polygon_coordinates.push(latlng);
        if (point === polygon[0]) {
          strokeColor = point.strokeColor || this.controller.polygons_conf.strokeColor;
          strokeOpacity = point.strokeOpacity || this.controller.polygons_conf.strokeOpacity;
          strokeWeight = point.strokeWeight || this.controller.polygons_conf.strokeWeight;
          fillColor = point.fillColor || this.controller.polygons_conf.fillColor;
          fillOpacity = point.fillOpacity || this.controller.polygons_conf.fillOpacity;
          clickable = point.clickable || this.controller.polygons_conf.clickable;
        }
      }
      polyOptions = {
        path: polyline_coordinates,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        clickable: clickable,
        zIndex: zIndex
      };
      mergedOptions = this.mergeObjects(controller.polygons_conf.raw, polyOptions);
      this.serviceObject = new google.maps.Polygon(mergedOptions);
    }

    return Polygon;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Polyline = (function(_super) {

    __extends(Polyline, _super);

    Polyline.include(Gmaps4Rails.Interfaces.Basic);

    Polyline.include(Gmaps4Rails.Google.Shared);

    Polyline.extend(Gmaps4Rails.Polyline.Class);

    Polyline.extend(Gmaps4Rails.Configuration);

    function Polyline(polyline, controller) {
      var clickable, decoded_array, element, mergedOptions, point, polyOptions, polyline_coordinates, strokeColor, strokeOpacity, strokeWeight, zIndex, _i, _j, _len, _len2;
      polyline_coordinates = [];
      for (_i = 0, _len = polyline.length; _i < _len; _i++) {
        element = polyline[_i];
        if (element.coded_array != null) {
          decoded_array = new google.maps.geometry.encoding.decodePath(element.coded_array);
          for (_j = 0, _len2 = decoded_array.length; _j < _len2; _j++) {
            point = decoded_array[_j];
            polyline_coordinates.push(point);
          }
        } else {
          if (element === polyline[0]) {
            strokeColor = element.strokeColor || controller.polylines_conf.strokeColor;
            strokeOpacity = element.strokeOpacity || controller.polylines_conf.strokeOpacity;
            strokeWeight = element.strokeWeight || controller.polylines_conf.strokeWeight;
            clickable = element.clickable || controller.polylines_conf.clickable;
            zIndex = element.zIndex || controller.polylines_conf.zIndex;
          }
          if ((element.lat != null) && (element.lng != null)) {
            polyline_coordinates.push(this.createLatLng(element.lat, element.lng));
          }
        }
      }
      polyOptions = {
        path: polyline_coordinates,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        clickable: clickable,
        zIndex: zIndex
      };
      mergedOptions = this.mergeObjects(controller.polylines_conf.raw, polyOptions);
      this.serviceObject = new google.maps.Polyline(mergedOptions);
      this.serviceObject.setMap(controller.getMapObject());
    }

    return Polyline;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsGoogle = (function(_super) {

    __extends(Gmaps4RailsGoogle, _super);

    Gmaps4RailsGoogle.include(Gmaps4Rails.Google.Shared);

    Gmaps4RailsGoogle.prototype.getModule = function() {
      return Gmaps4Rails.Google;
    };

    function Gmaps4RailsGoogle() {
      Gmaps4RailsGoogle.__super__.constructor.apply(this, arguments);
      this.markerImages = [];
    }

    Gmaps4RailsGoogle.prototype.createClusterer = function(markers_array) {
      return new MarkerClusterer(this.getMapObject(), markers_array, {
        maxZoom: this.markers_conf.clusterer_maxZoom,
        gridSize: this.markers_conf.clusterer_gridSize,
        styles: this.customClusterer()
      });
    };

    Gmaps4RailsGoogle.prototype.clearClusterer = function() {
      return this.markerClusterer.clearMarkers();
    };

    Gmaps4RailsGoogle.prototype.clusterize = function() {
      var marker, markers_array, _i, _len, _ref;
      if (this.markers_conf.do_clustering) {
        if (this.markerClusterer != null) this.clearClusterer();
        markers_array = [];
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          markers_array.push(marker.serviceObject);
        }
        return this.markerClusterer = this.createClusterer(markers_array);
      }
    };

    Gmaps4RailsGoogle.prototype._closeVisibleInfoWindow = function() {
      if (this.visibleInfowindow != null) return this.visibleInfowindow.close();
    };

    Gmaps4RailsGoogle.prototype._setVisibleInfoWindow = function(infowindow) {
      return this.visibleInfowindow = infowindow;
    };

    return Gmaps4RailsGoogle;

  })(Gmaps4Rails.BaseController);

}).call(this);