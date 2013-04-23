(function() {

  Gmaps4Rails.Bing = {};

  Gmaps4Rails.Bing.Shared = {
    createPoint: function(lat, lng) {
      return new Microsoft.Maps.Point(lat, lng);
    },
    createLatLng: function(lat, lng) {
      return new Microsoft.Maps.Location(lat, lng);
    },
    createLatLngBounds: function() {},
    createSize: function(width, height) {
      return new google.maps.Size(width, height);
    },
    _addToMap: function(object) {
      return this.controller.getMapObject().entities.push(object);
    },
    _removeFromMap: function(object) {
      return this.controller.getMapObject().entities.remove(object);
    }
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Bing.Map = (function(_super) {

    __extends(Map, _super);

    Map.include(Gmaps4Rails.Interfaces.Map);

    Map.include(Gmaps4Rails.Map);

    Map.include(Gmaps4Rails.Bing.Shared);

    Map.include(Gmaps4Rails.Configuration);

    Map.prototype.CONF = {
      type: "road"
    };

    function Map(map_options, controller) {
      var bingOptions, defaultOptions, mergedBingOptions;
      this.controller = controller;
      defaultOptions = this.setConf();
      this.options = this.mergeObjects(map_options, defaultOptions);
      bingOptions = {
        credentials: this.options.provider_key,
        mapTypeId: this._getMapType(this.options),
        center: this.createLatLng(this.options.center_latitude, this.options.center_longitude),
        zoom: this.options.zoom
      };
      mergedBingOptions = this.mergeObjects(map_options.raw, bingOptions);
      this.serviceObject = new Microsoft.Maps.Map(document.getElementById(this.options.id), mergedBingOptions);
    }

    Map.prototype.extendBoundsWithMarkers = function() {
      var locationsArray, marker, _i, _len, _ref;
      locationsArray = [];
      _ref = this.controller.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        locationsArray.push(marker.serviceObject.getLocation());
      }
      return this.boundsObject = Microsoft.Maps.LocationRect.fromLocations(locationsArray);
    };

    Map.prototype.extendBoundsWithPolyline = function(polyline) {};

    Map.prototype.extendBoundsWithPolygon = function(polygon) {};

    Map.prototype.extendBoundsWithCircle = function(circle) {};

    Map.prototype.extendBound = function(bound) {};

    Map.prototype.adaptToBounds = function() {
      return this._fitBounds();
    };

    Map.prototype.centerMapOnUser = function(position) {
      return this.serviceObject.setView({
        center: position
      });
    };

    Map.prototype._fitBounds = function() {
      return this.serviceObject.setView({
        bounds: this.boundsObject
      });
    };

    Map.prototype._getMapType = function(map_options) {
      switch (map_options.type) {
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

    return Map;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Bing.Marker = (function(_super) {

    __extends(Marker, _super);

    Marker.include(Gmaps4Rails.Interfaces.Marker);

    Marker.include(Gmaps4Rails.Bing.Shared);

    Marker.include(Gmaps4Rails.Marker.Instance);

    Marker.extend(Gmaps4Rails.Marker.Class);

    Marker.extend(Gmaps4Rails.Configuration);

    Marker.CONF = {
      infobox: "description"
    };

    function Marker(args, controller) {
      var anchorLatLng, markerLatLng;
      this.controller = controller;
      markerLatLng = this.createLatLng(args.lat, args.lng);
      anchorLatLng = this._createImageAnchorPosition([args.lat, args.lng]);
      if (args.marker_picture != null) {
        this.serviceObject = new Microsoft.Maps.Pushpin(markerLatLng, {
          draggable: args.marker_draggable,
          anchor: anchorLatLng,
          icon: args.marker_picture,
          height: args.marker_height,
          text: args.marker_title,
          width: args.marker_width
        });
      } else {
        this.serviceObject = new Microsoft.Maps.Pushpin(markerLatLng, {
          draggable: args.marker_draggable,
          anchor: anchorLatLng,
          text: args.marker_title
        });
      }
      this._addToMap(this.serviceObject);
    }

    Marker.prototype.createInfoWindow = function() {
      if (this.description != null) {
        if (this.controller.markers_conf.infobox === "description") {
          this.info_window = new Microsoft.Maps.Infobox(this.serviceObject.getLocation(), {
            description: this.description,
            visible: false,
            showCloseButton: true
          });
        } else {
          this.info_window = new Microsoft.Maps.Infobox(this.serviceObject.getLocation(), {
            htmlContent: this.description,
            visible: false
          });
        }
        Microsoft.Maps.Events.addHandler(this.serviceObject, 'click', this._openInfoWindow(this.controller, this.info_window));
        return this._addToMap(this.info_window);
      }
    };

    Marker.prototype.isVisible = function() {
      return true;
    };

    Marker.prototype.clear = function() {
      return this._removeFromMap(this.serviceObject);
    };

    Marker.prototype.show = function() {
      return this.serviceObject.setOptions({
        visible: true
      });
    };

    Marker.prototype.hide = function() {
      return this.serviceObject.setOptions({
        visible: false
      });
    };

    Marker.prototype._openInfoWindow = function(controller, infoWindow) {
      return function() {
        if (controller.visibleInfoWindow) {
          controller.visibleInfoWindow.setOptions({
            visible: false
          });
        }
        infoWindow.setOptions({
          visible: true
        });
        return controller.visibleInfoWindow = infoWindow;
      };
    };

    Marker.prototype._createImageAnchorPosition = function(anchorLocation) {
      if (anchorLocation == null) {
        return null;
      }
      return this.createPoint(anchorLocation[0], anchorLocation[1]);
    };

    return Marker;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsBing = (function(_super) {

    __extends(Gmaps4RailsBing, _super);

    Gmaps4RailsBing.include(Gmaps4Rails.Bing.Shared);

    function Gmaps4RailsBing() {
      Gmaps4RailsBing.__super__.constructor.apply(this, arguments);
    }

    Gmaps4RailsBing.prototype.getModule = function() {
      return Gmaps4Rails.Bing;
    };

    Gmaps4RailsBing.prototype.createClusterer = function(marker_serviceObject_array) {};

    Gmaps4RailsBing.prototype.clearClusterer = function() {};

    Gmaps4RailsBing.prototype.clearMarkers = function() {};

    return Gmaps4RailsBing;

  })(Gmaps4Rails.BaseController);

}).call(this);
(function() {



}).call(this);
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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Gmaps4Rails.Google.Marker = (function(_super) {

    __extends(Marker, _super);

    Marker.include(Gmaps4Rails.Interfaces.Marker);

    Marker.include(Gmaps4Rails.Google.Shared);

    Marker.include(Gmaps4Rails.Marker.Instance);

    Marker.extend(Gmaps4Rails.Marker.Class);

    Marker.extend(Gmaps4Rails.Configuration);

    Marker.CONF = {
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
        if (this.controller.markers_conf.custom_infowindow_class != null) {
          boxText = document.createElement("div");
          boxText.setAttribute("class", this.controller.markers_conf.custom_infowindow_class);
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
      mergedOptions = this.mergeObjects(this.controller.markers_conf.raw, defaultOptions);
      return this.serviceObject = new google.maps.Marker(mergedOptions);
    };

    Marker.prototype._createRichMarker = function(markerLatLng, args) {
      var _ref, _ref1;
      return this.serviceObject = new RichMarker({
        position: markerLatLng,
        map: this.getMap(),
        draggable: args.marker_draggable,
        content: args.rich_marker,
        flat: ((_ref = args.marker_anchor != null) != null ? _ref : args.marker_anchor[1]) ? void 0 : false,
        anchor: ((_ref1 = args.marker_anchor != null) != null ? _ref1 : args.marker_anchor[0]) ? void 0 : null,
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
      mergedOptions = this.mergeObjects(this.controller.markers_conf.raw, defaultOptions);
      return this.serviceObject = new google.maps.Marker(mergedOptions);
    };

    Marker.prototype._includeMarkerImage = function(obj) {
      var index, object, _i, _len, _ref;
      _ref = this.controller.markerImages;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        object = _ref[index];
        if (object.url === obj) {
          return index;
        }
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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Polygon = (function(_super) {

    __extends(Polygon, _super);

    Polygon.include(Gmaps4Rails.Interfaces.Basic);

    Polygon.include(Gmaps4Rails.Google.Shared);

    Polygon.extend(Gmaps4Rails.Polygon.Class);

    Polygon.extend(Gmaps4Rails.Configuration);

    function Polygon(polygon, controller) {
      var clickable, fillColor, fillOpacity, latlng, mergedOptions, point, polyOptions, polygon_coordinates, strokeColor, strokeOpacity, strokeWeight, zIndex, _i, _len;
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
          zIndex = point.zIndex || this.controller.polygons_conf.zIndex;
        }
      }
      polyOptions = {
        path: polygon_coordinates,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        clickable: clickable,
        zIndex: zIndex
      };
      mergedOptions = this.mergeObjects(controller.polygons_conf.raw, polyOptions);
      this.serviceObject = new google.maps.Polygon(mergedOptions);
      this.serviceObject.setMap(controller.getMapObject());
    }

    return Polygon;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Google.Polyline = (function(_super) {

    __extends(Polyline, _super);

    Polyline.include(Gmaps4Rails.Interfaces.Basic);

    Polyline.include(Gmaps4Rails.Google.Shared);

    Polyline.extend(Gmaps4Rails.Polyline.Class);

    Polyline.extend(Gmaps4Rails.Configuration);

    function Polyline(polyline, controller) {
      var clickable, decoded_array, element, icons, mergedOptions, point, polyOptions, polyline_coordinates, strokeColor, strokeOpacity, strokeWeight, zIndex, _i, _j, _len, _len1;
      polyline_coordinates = [];
      for (_i = 0, _len = polyline.length; _i < _len; _i++) {
        element = polyline[_i];
        if (element.coded_array != null) {
          decoded_array = new google.maps.geometry.encoding.decodePath(element.coded_array);
          for (_j = 0, _len1 = decoded_array.length; _j < _len1; _j++) {
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
            icons = element.icons || controller.polylines_conf.icons;
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
        zIndex: zIndex,
        icons: icons
      };
      mergedOptions = this.mergeObjects(controller.polylines_conf.raw, polyOptions);
      this.serviceObject = new google.maps.Polyline(mergedOptions);
      this.serviceObject.setMap(controller.getMapObject());
    }

    return Polyline;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
        if (this.markerClusterer != null) {
          this.clearClusterer();
        }
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
      if (this.visibleInfowindow != null) {
        return this.visibleInfowindow.close();
      }
    };

    Gmaps4RailsGoogle.prototype._setVisibleInfoWindow = function(infowindow) {
      return this.visibleInfowindow = infowindow;
    };

    return Gmaps4RailsGoogle;

  })(Gmaps4Rails.BaseController);

}).call(this);
(function() {



}).call(this);
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
      if (offset === null) {
        return null;
      }
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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      return this.style_mark.graphicTitle = args.marker_title;
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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Openlayers.Polyline = (function(_super) {

    __extends(Polyline, _super);

    Polyline.include(Gmaps4Rails.Interfaces.Basic);

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      if (this.polylinesLayer != null) {
        return;
      }
      this.polylinesLayer = new OpenLayers.Layer.Vector("Polylines", null);
      this.polylinesLayer.events.register("featureselected", this.polylinesLayer, this._onFeatureSelect);
      this.polylinesLayer.events.register("featureunselected", this.polylinesLayer, this._onFeatureUnselect);
      this.polylinesControl = new OpenLayers.Control.DrawFeature(this.polylinesLayer, OpenLayers.Handler.Path);
      this.getMapObject().addLayer(this.polylinesLayer);
      return this.getMapObject().addControl(this.polylinesControl);
    };

    Gmaps4RailsOpenlayers.prototype._createMarkersLayer = function() {
      if (this.markersLayer != null) {
        return;
      }
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
          if (feature.cluster) {
            pix = feature.cluster.length + 10;
          }
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
(function() {



}).call(this);
(function() {



}).call(this);
