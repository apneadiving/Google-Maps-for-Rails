(function() {
  var moduleKeywords,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moduleKeywords = ['extended', 'included'];

  this.Gmaps4Rails = {};

  this.Gmaps4Rails.Common = (function() {

    function Common() {}

    Common.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Common.include = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Common.prototype.exists = function(var_name) {
      return var_name !== "" && typeof var_name !== "undefined";
    };

    Common.prototype.mergeObjects = function(object, defaultObject) {
      return this.constructor.mergeObjects(object, defaultObject);
    };

    Common.mergeObjects = function(object, defaultObject) {
      var copy_object, key, value;
      copy_object = {};
      for (key in object) {
        value = object[key];
        copy_object[key] = value;
      }
      for (key in defaultObject) {
        value = defaultObject[key];
        if (copy_object[key] == null) {
          copy_object[key] = value;
        }
      }
      return copy_object;
    };

    Common.mergeWith = function(object) {
      var key, value, _results;
      _results = [];
      for (key in object) {
        value = object[key];
        if (this[key] == null) {
          _results.push(this[key] = value);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Common.prototype.random = function() {
      return Math.random() * 2 - 1;
    };

    return Common;

  })();

}).call(this);
(function() {

  this.Gmaps4Rails.Configuration = {
    setConf: function() {
      if (this.CONF != null) {
        return this.mergeObjects(this.CONF, this.DEFAULT_CONF);
      } else {
        return this.DEFAULT_CONF;
      }
    }
  };

}).call(this);
(function() {

  this.Gmaps = {
    triggerOldOnload: function() {
      if (typeof window.Gmaps.oldOnload === 'function') {
        return window.Gmaps.oldOnload();
      }
    },
    loadMaps: function() {
      var key, value, _ref, _results;
      _ref = window.Gmaps;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        if (/^load_/.test(key)) {
          _results.push(window.Gmaps[key]());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Circle = {};

  this.Gmaps4Rails.Circle.Class = {
    DEFAULT_CONF: {
      fillColor: "#00AAFF",
      fillOpacity: 0.35,
      strokeColor: "#FFAA00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
      zIndex: null
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Kml = {};

  this.Gmaps4Rails.Kml.Instance = {
    DEFAULT_CONF: {
      clickable: true,
      preserveViewport: false,
      suppressInfoWindows: false
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Map = {
    DEFAULT_CONF: {
      id: 'map',
      draggable: true,
      detect_location: false,
      center_on_user: false,
      center_latitude: 0,
      center_longitude: 0,
      zoom: 7,
      maxZoom: null,
      minZoom: null,
      auto_adjust: true,
      auto_zoom: true,
      bounds: [],
      raw: {}
    },
    adjustToBounds: function() {
      this.boundsObject = this.createLatLngBounds();
      this.extendBoundsWithMarkers();
      this.extendBoundsWithPolylines();
      this.extendBoundsWithPolygons();
      this.extendBoundsWithCircles();
      this.extendBoundsWithLatLng();
      return this.adaptToBounds();
    },
    extendBoundsWithMarkers: function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.controller.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (marker.isVisible()) {
          _results.push(this.extendBoundsWithMarker(marker));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    extendBoundsWithPolylines: function() {
      var polyline, _i, _len, _ref, _results;
      _ref = this.controller.polylines;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        _results.push(this.extendBoundsWithPolyline(polyline));
      }
      return _results;
    },
    extendBoundsWithPolygons: function() {
      var polygon, _i, _len, _ref, _results;
      _ref = this.controller.polygons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        _results.push(this.extendBoundsWithPolygon(polygon));
      }
      return _results;
    },
    extendBoundsWithCircles: function() {
      var circle, _i, _len, _ref, _results;
      _ref = this.controller.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(this.extendBoundsWithCircle(circle));
      }
      return _results;
    },
    extendBoundsWithLatLng: function() {
      var bound, _i, _len, _ref, _results;
      _ref = this.options.bounds;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bound = _ref[_i];
        _results.push(this.extendBound(bound));
      }
      return _results;
    },
    autoAdjustRequested: function() {
      return this.options.auto_adjust || this.options.bounds.length > 0;
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Marker = {};

  this.Gmaps4Rails.Marker.Class = {
    DEFAULT_CONF: {
      title: null,
      picture: null,
      width: 22,
      length: 32,
      draggable: false,
      do_clustering: false,
      randomize: false,
      max_random_distance: 100,
      list_container: null,
      offset: 0,
      raw: {}
    }
  };

  this.Gmaps4Rails.Marker.Instance = {
    getMap: function() {
      return this.controller.getMapObject();
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Polygon = {};

  this.Gmaps4Rails.Polygon.Class = {
    DEFAULT_CONF: {
      strokeColor: "#FFAA00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#000000",
      fillOpacity: 0.35,
      clickable: false
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.Polyline = {};

  this.Gmaps4Rails.Polyline.Class = {
    DEFAULT_CONF: {
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: false,
      zIndex: null,
      icons: null
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.CircleController = {
    addCircles: function(circleData) {
      var circleArgs, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = circleData.length; _i < _len; _i++) {
        circleArgs = circleData[_i];
        _results.push(this.circles.push(this.createCircle(circleArgs)));
      }
      return _results;
    },
    replaceCircles: function(circleData) {
      this.clearCircles();
      this.addCircles(circleData);
      return this.adjustMapToBounds();
    },
    clearCircles: function() {
      var circle, _i, _len, _ref;
      _ref = this.circles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        circle.clear();
      }
      return this.circles = [];
    },
    showCircles: function() {
      var circle, _i, _len, _ref, _results;
      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(circle.show());
      }
      return _results;
    },
    hideCircles: function() {
      var circle, _i, _len, _ref, _results;
      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(circle.hide());
      }
      return _results;
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.KmlController = {
    addKml: function(kmlData) {
      var kml, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = kmlData.length; _i < _len; _i++) {
        kml = kmlData[_i];
        _results.push(this.kmls.push(this.createKml(kml)));
      }
      return _results;
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.MarkerController = {
    addMarkers: function(markersData) {
      var index, lat, latLng, lng, markerData, newMarker, _i, _len;
      if (this.markerClusterer != null) {
        this.clearClusterer();
      }
      for (index = _i = 0, _len = markersData.length; _i < _len; index = ++_i) {
        markerData = markersData[index];
        lat = markerData.lat;
        lng = markerData.lng;
        if (this.markers_conf.randomize) {
          latLng = this.randomize(lat, lng);
          lat = latLng[0];
          lng = latLng[1];
        }
        newMarker = this.createMarker({
          "marker_picture": markerData.picture ? markerData.picture : this.markers_conf.picture,
          "marker_width": markerData.width ? markerData.width : this.markers_conf.width,
          "marker_height": markerData.height ? markerData.height : this.markers_conf.length,
          "marker_title": markerData.title ? markerData.title : null,
          "marker_anchor": markerData.marker_anchor ? markerData.marker_anchor : null,
          "shadow_anchor": markerData.shadow_anchor ? markerData.shadow_anchor : null,
          "shadow_picture": markerData.shadow_picture ? markerData.shadow_picture : null,
          "shadow_width": markerData.shadow_width ? markerData.shadow_width : null,
          "shadow_height": markerData.shadow_height ? markerData.shadow_height : null,
          "marker_draggable": markerData.draggable ? markerData.draggable : this.markers_conf.draggable,
          "rich_marker": markerData.rich_marker ? markerData.rich_marker : null,
          "zindex": markerData.zindex ? markerData.zindex : null,
          "lat": lat,
          "lng": lng,
          "index": index
        });
        Gmaps4Rails.Common.mergeWith.call(newMarker, markerData);
        newMarker.createInfoWindow();
        this.markers.push(newMarker);
      }
      return this.clusterize();
    },
    replaceMarkers: function(new_markers) {
      this.clearMarkers();
      this.markers = [];
      this.boundsObject = this.createLatLngBounds();
      return this.addMarkers(new_markers);
    },
    clearMarkers: function() {
      var marker, _i, _len, _ref;
      if (this.markerClusterer != null) {
        this.clearClusterer();
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.clear();
      }
      return this.markers = [];
    },
    showMarkers: function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(marker.show());
      }
      return _results;
    },
    hideMarkers: function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(marker.hide());
      }
      return _results;
    },
    randomize: function(Lat0, Lng0) {
      var Lat, Lng, dx, dy;
      dx = this.markers_conf.max_random_distance * this.random();
      dy = this.markers_conf.max_random_distance * this.random();
      Lat = parseFloat(Lat0) + (180 / Math.PI) * (dy / 6378137);
      Lng = parseFloat(Lng0) + (90 / Math.PI) * (dx / 6378137) / Math.cos(Lat0);
      return [Lat, Lng];
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.PolygonController = {
    addPolygons: function(polygonData) {
      var polygonArgs, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = polygonData.length; _i < _len; _i++) {
        polygonArgs = polygonData[_i];
        _results.push(this.polygons.push(this.createPolygon(polygonArgs)));
      }
      return _results;
    },
    replacePolygons: function(polylineData) {
      this.clearPolygons();
      this.addPolygons(polylineData);
      return this.adjustMapToBounds();
    },
    clearPolygons: function() {
      var polygon, _i, _len, _ref;
      _ref = this.polygons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        polygon.clear();
      }
      return this.polygons = [];
    },
    showPolygons: function() {
      var polygon, _i, _len, _ref, _results;
      _ref = this.polygons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        _results.push(polygon.show());
      }
      return _results;
    },
    hidePolygons: function() {
      var polygon, _i, _len, _ref, _results;
      _ref = this.polygons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        _results.push(polygon.hide());
      }
      return _results;
    }
  };

}).call(this);
(function() {

  this.Gmaps4Rails.PolylineController = {
    replacePolylines: function(polylineData) {
      this.clearPolylines();
      this.addPolylines(polylineData);
      return this.adjustMapToBounds();
    },
    clearPolylines: function() {
      var polyline, _i, _len, _ref;
      _ref = this.polylines;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        polyline.clear();
      }
      return this.polylines = [];
    },
    addPolylines: function(polylineData) {
      var polylineArgs, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = polylineData.length; _i < _len; _i++) {
        polylineArgs = polylineData[_i];
        _results.push(this.polylines.push(this.createPolyline(polylineArgs)));
      }
      return _results;
    },
    showPolylines: function() {
      var polyline, _i, _len, _ref, _results;
      _ref = this.polylines;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        _results.push(polyline.show());
      }
      return _results;
    },
    hidePolylines: function() {
      var polyline, _i, _len, _ref, _results;
      _ref = this.polylines;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        _results.push(polyline.hide());
      }
      return _results;
    }
  };

}).call(this);
(function() {

  Gmaps4Rails.Interfaces || (Gmaps4Rails.Interfaces = {});

  Gmaps4Rails.Interfaces.Basic = {
    clear: function() {
      throw "clear should be implemented";
    },
    show: function() {
      throw "show should be implemented";
    },
    hide: function() {
      throw "hide should be implemented";
    },
    isVisible: function() {
      throw "hide should be implemented";
    }
  };

}).call(this);
(function() {

  Gmaps4Rails.Interfaces || (Gmaps4Rails.Interfaces = {});

  Gmaps4Rails.Interfaces.Controller = {
    getModule: function() {
      throw "getModule should be implemented in controller";
    },
    createClusterer: function(markers_array) {
      throw "createClusterer should be implemented in controller";
    },
    clearClusterer: function() {
      throw "clearClusterer should be implemented in controller";
    }
  };

}).call(this);
(function() {

  Gmaps4Rails.Interfaces || (Gmaps4Rails.Interfaces = {});

  Gmaps4Rails.Interfaces.Map = {
    extendBoundsWithMarker: function(marker) {
      throw "extendBoundsWithMarker should be implemented in controller";
    },
    extendBoundsWithPolyline: function(polyline) {
      throw "extendBoundsWithPolyline should be implemented in controller";
    },
    extendBoundsWithPolygon: function(polygon) {
      throw "extendBoundsWithPolygon should be implemented in controller";
    },
    extendBoundsWithCircle: function(circle) {
      throw "extendBoundsWithCircle should be implemented in controller";
    },
    extendBound: function(bound) {
      throw "extendBound should be implemented in controller";
    },
    adaptToBounds: function() {
      throw "adaptToBounds should be implemented in controller";
    },
    fitBounds: function() {
      throw "fitBounds should be implemented in controller";
    },
    centerMapOnUser: function(position) {
      throw "centerMapOnUser should be implemented in controller";
    }
  };

}).call(this);
(function() {

  Gmaps4Rails.Interfaces || (Gmaps4Rails.Interfaces = {});

  Gmaps4Rails.Interfaces.Marker = {
    createInfoWindow: function() {
      throw "createInfoWindow should be implemented in marker";
    },
    clear: function() {
      throw "clear should be implemented in marker";
    },
    show: function() {
      throw "show should be implemented in marker";
    },
    hide: function() {
      throw "hide should be implemented in marker";
    }
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.BaseController = (function(_super) {

    __extends(BaseController, _super);

    BaseController.include(Gmaps4Rails.MarkerController);

    BaseController.include(Gmaps4Rails.PolylineController);

    BaseController.include(Gmaps4Rails.PolygonController);

    BaseController.include(Gmaps4Rails.CircleController);

    BaseController.include(Gmaps4Rails.KmlController);

    BaseController.include(Gmaps4Rails.Interfaces.Controller);

    BaseController.prototype.visibleInfoWindow = null;

    BaseController.prototype.userLocation = null;

    BaseController.prototype.afterMapInitialization = function() {
      return false;
    };

    BaseController.prototype.geolocationSuccess = function() {
      return false;
    };

    BaseController.prototype.geolocationFailure = function() {
      return false;
    };

    BaseController.prototype.callback = function() {
      return false;
    };

    BaseController.prototype.customClusterer = function() {
      return false;
    };

    BaseController.prototype.infobox = function() {
      return false;
    };

    BaseController.prototype.jsTemplate = false;

    BaseController.prototype.map_options = {};

    BaseController.prototype.markers = [];

    BaseController.prototype.boundsObject = null;

    BaseController.prototype.polygons = [];

    BaseController.prototype.polylines = [];

    BaseController.prototype.circles = [];

    BaseController.prototype.markerClusterer = null;

    BaseController.prototype.markerImages = [];

    BaseController.prototype.kmls = [];

    BaseController.prototype.rootModule = null;

    function BaseController() {
      this.rootModule = this.getModule();
      if (this.rootModule.Marker != null) {
        this.markers_conf = this.rootModule.Marker.setConf();
      }
      if (this.rootModule.Polyline != null) {
        this.polylines_conf = this.rootModule.Polyline.setConf();
      }
      if (this.rootModule.Polygon != null) {
        this.polygons_conf = this.rootModule.Polygon.setConf();
      }
      if (this.rootModule.Circle != null) {
        this.circles_conf = this.rootModule.Circle.setConf();
      }
    }

    BaseController.prototype.createMap = function() {
      return new this.rootModule.Map(this.map_options, this);
    };

    BaseController.prototype.createMarker = function(args) {
      return new this.rootModule.Marker(args, this);
    };

    BaseController.prototype.createPolyline = function(args) {
      return new this.rootModule.Polyline(args, this);
    };

    BaseController.prototype.createPolygon = function(args) {
      return new this.rootModule.Polygon(args, this);
    };

    BaseController.prototype.createCircle = function(args) {
      return new this.rootModule.Circle(args, this);
    };

    BaseController.prototype.createKml = function(args) {
      return new this.rootModule.Kml(args, this);
    };

    BaseController.prototype.initialize = function() {
      var center_on_user, detectUserLocation;
      detectUserLocation = this.map_options.detect_location || this.map_options.center_on_user;
      center_on_user = this.map_options.center_on_user;
      this.map = this.createMap();
      this.afterMapInitialization();
      delete this.map_options;
      if (detectUserLocation) {
        return this.findUserLocation(this, center_on_user);
      }
    };

    BaseController.prototype.getMapObject = function() {
      return this.map.serviceObject;
    };

    BaseController.prototype.adjustMapToBounds = function() {
      if (this.map.autoAdjustRequested()) {
        return this.map.adjustToBounds();
      }
    };

    BaseController.prototype.clusterize = function() {
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

    BaseController.prototype.findUserLocation = function(controller, center_on_user) {
      var positionFailure, positionSuccessful;
      if (navigator.geolocation) {
        positionSuccessful = function(position) {
          controller.userLocation = controller.createLatLng(position.coords.latitude, position.coords.longitude);
          controller.geolocationSuccess();
          if (center_on_user) {
            return controller.map.centerMapOnUser(controller.userLocation);
          }
        };
        positionFailure = function(error) {
          return controller.geolocationFailure(true);
        };
        return navigator.geolocation.getCurrentPosition(positionSuccessful, positionFailure);
      } else {
        return controller.geolocationFailure(false);
      }
    };

    return BaseController;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {



}).call(this);
