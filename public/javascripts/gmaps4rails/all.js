(function() {
  var moduleKeywords,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moduleKeywords = ['extended', 'included'];

  this.Gmaps4Rails = {};

  this.Gmaps4Rails.Common = (function() {

    function Common() {}

    Common.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this[key] = value;
      }
      if ((_ref = obj.extended) != null) _ref.apply(this);
      return this;
    };

    Common.include = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) _ref.apply(this);
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
        if (copy_object[key] == null) copy_object[key] = value;
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
      if (this.CONF) {
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
      zIndex: null
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
      var index, lat, latLng, lng, markerData, newMarker, _len;
      if (this.markerClusterer != null) this.clearClusterer();
      for (index = 0, _len = markersData.length; index < _len; index++) {
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
      if (this.markerClusterer != null) this.clearClusterer();
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
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      if (detectUserLocation) return this.findUserLocation(this, center_on_user);
    };

    BaseController.prototype.getMapObject = function() {
      return this.map.serviceObject;
    };

    BaseController.prototype.adjustMapToBounds = function() {
      if (this.map.autoAdjustRequested()) return this.map.adjustToBounds();
    };

    BaseController.prototype.clusterize = function() {
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
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsBing = (function(_super) {

    __extends(Gmaps4RailsBing, _super);

    function Gmaps4RailsBing() {
      Gmaps4RailsBing.__super__.constructor.apply(this, arguments);
      this.map_options = {
        type: "road"
      };
      this.markers_conf = {
        infobox: "description"
      };
      this.mergeWithDefault("map_options");
      this.mergeWithDefault("markers_conf");
    }

    Gmaps4RailsBing.prototype.getMapType = function() {
      switch (this.map_options.type) {
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

    Gmaps4RailsBing.prototype.createPoint = function(lat, lng) {
      return new Microsoft.Maps.Point(lat, lng);
    };

    Gmaps4RailsBing.prototype.createLatLng = function(lat, lng) {
      return new Microsoft.Maps.Location(lat, lng);
    };

    Gmaps4RailsBing.prototype.createLatLngBounds = function() {};

    Gmaps4RailsBing.prototype.createMap = function() {
      return new Microsoft.Maps.Map(document.getElementById(this.map_options.id), {
        credentials: this.map_options.provider_key,
        mapTypeId: this.getMapType(),
        center: this.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude),
        zoom: this.map_options.zoom
      });
    };

    Gmaps4RailsBing.prototype.createSize = function(width, height) {
      return new google.maps.Size(width, height);
    };

    Gmaps4RailsBing.prototype.createMarker = function(args) {
      var marker, markerLatLng;
      markerLatLng = this.createLatLng(args.Lat, args.Lng);
      marker;
      if (args.marker_picture === "") {
        marker = new Microsoft.Maps.Pushpin(this.createLatLng(args.Lat, args.Lng), {
          draggable: args.marker_draggable,
          anchor: this.createImageAnchorPosition(args.Lat, args.Lng),
          text: args.marker_title
        });
      } else {
        marker = new Microsoft.Maps.Pushpin(this.createLatLng(args.Lat, args.Lng), {
          draggable: args.marker_draggable,
          anchor: this.createImageAnchorPosition(args.Lat, args.Lng),
          icon: args.marker_picture,
          height: args.marker_height,
          text: args.marker_title,
          width: args.marker_width
        });
      }
      this.addToMap(marker);
      return marker;
    };

    Gmaps4RailsBing.prototype.clearMarkers = function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.clearMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsBing.prototype.clearMarker = function(marker) {
      return this.removeFromMap(marker.serviceObject);
    };

    Gmaps4RailsBing.prototype.showMarkers = function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.showMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsBing.prototype.showMarker = function(marker) {
      return marker.serviceObject.setOptions({
        visible: true
      });
    };

    Gmaps4RailsBing.prototype.hideMarkers = function() {
      var marker, _i, _len, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.hideMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsBing.prototype.hideMarker = function(marker) {
      return marker.serviceObject.setOptions({
        visible: false
      });
    };

    Gmaps4RailsBing.prototype.extendBoundsWithMarkers = function() {
      var locationsArray, marker, _i, _len, _ref;
      locationsArray = [];
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        locationsArray.push(marker.serviceObject.getLocation());
      }
      return this.boundsObject = Microsoft.Maps.LocationRect.fromLocations(locationsArray);
    };

    Gmaps4RailsBing.prototype.createClusterer = function(markers_array) {};

    Gmaps4RailsBing.prototype.clearClusterer = function() {};

    Gmaps4RailsBing.prototype.clusterize = function() {};

    Gmaps4RailsBing.prototype.createInfoWindow = function(marker_container) {
      var currentMap;
      if (marker_container.description != null) {
        if (this.markers_conf.infobox === "description") {
          marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), {
            description: marker_container.description,
            visible: false,
            showCloseButton: true
          });
        } else {
          marker_container.info_window = new Microsoft.Maps.Infobox(marker_container.serviceObject.getLocation(), {
            htmlContent: marker_container.description,
            visible: false
          });
        }
        currentMap = this;
        Microsoft.Maps.Events.addHandler(marker_container.serviceObject, 'click', this.openInfoWindow(currentMap, marker_container.info_window));
        return this.addToMap(marker_container.info_window);
      }
    };

    Gmaps4RailsBing.prototype.openInfoWindow = function(currentMap, infoWindow) {
      return function() {
        if (currentMap.visibleInfoWindow) {
          currentMap.visibleInfoWindow.setOptions({
            visible: false
          });
        }
        infoWindow.setOptions({
          visible: true
        });
        return currentMap.visibleInfoWindow = infoWindow;
      };
    };

    Gmaps4RailsBing.prototype.fitBounds = function() {
      return this.serviceObject.setView({
        bounds: this.boundsObject
      });
    };

    Gmaps4RailsBing.prototype.addToMap = function(object) {
      return this.serviceObject.entities.push(object);
    };

    Gmaps4RailsBing.prototype.removeFromMap = function(object) {
      return this.serviceObject.entities.remove(object);
    };

    Gmaps4RailsBing.prototype.centerMapOnUser = function() {
      return this.serviceObject.setView({
        center: this.userLocation
      });
    };

    Gmaps4RailsBing.prototype.updateBoundsWithPolylines = function() {};

    Gmaps4RailsBing.prototype.updateBoundsWithPolygons = function() {};

    Gmaps4RailsBing.prototype.updateBoundsWithCircles = function() {};

    Gmaps4RailsBing.prototype.extendMapBounds = function() {};

    Gmaps4RailsBing.prototype.adaptMapToBounds = function() {
      return this.fitBounds();
    };

    return Gmaps4RailsBing;

  })(Gmaps4Rails);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsMapquest = (function(_super) {

    __extends(Gmaps4RailsMapquest, _super);

    function Gmaps4RailsMapquest() {
      Gmaps4RailsMapquest.__super__.constructor.apply(this, arguments);
      this.map_options = {
        type: "map"
      };
      this.markers_conf = {};
      this.mergeWithDefault("markers_conf");
      this.mergeWithDefault("map_options");
    }

    Gmaps4RailsMapquest.prototype.createPoint = function(lat, lng) {
      return new MQA.Poi({
        lat: lat,
        lng: lng
      });
    };

    Gmaps4RailsMapquest.prototype.createLatLng = function(lat, lng) {
      return {
        lat: lat,
        lng: lng
      };
    };

    Gmaps4RailsMapquest.prototype.createLatLngBounds = function() {};

    Gmaps4RailsMapquest.prototype.createMap = function() {
      var map;
      map = new MQA.TileMap(document.getElementById(this.map_options.id), this.map_options.zoom, {
        lat: this.map_options.center_latitude,
        lng: this.map_options.center_longitude
      }, this.map_options.type);
      MQA.withModule('zoomcontrol3', (function() {
        return map.addControl(new MQA.LargeZoomControl3(), new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT));
      }));
      return map;
    };

    Gmaps4RailsMapquest.prototype.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {};

    Gmaps4RailsMapquest.prototype.createMarker = function(args) {
      var icon, marker;
      marker = new MQA.Poi({
        lat: args.Lat,
        lng: args.Lng
      });
      if (args.marker_picture !== "") {
        icon = new MQA.Icon(args.marker_picture, args.marker_height, args.marker_width);
        marker.setIcon(icon);
        if (args.marker_anchor !== null) {
          marker.setBias({
            x: args.marker_anchor[0],
            y: args.marker_anchor[1]
          });
        }
      }
      if (args.shadow_picture !== "") {
        icon = new MQA.Icon(args.shadow_picture, args.shadow_height, args.shadow_width);
        marker.setShadow(icon);
        if (args.shadow_anchor !== null) {
          marker.setShadowOffset({
            x: args.shadow_anchor[0],
            y: args.shadow_anchor[1]
          });
        }
      }
      this.addToMap(marker);
      return marker;
    };

    Gmaps4RailsMapquest.prototype.clearMarkers = function() {
      var marker, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        _results.push(this.clearMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsMapquest.prototype.showMarkers = function() {
      var marker, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        _results.push(this.showMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsMapquest.prototype.hideMarkers = function() {
      var marker, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        _results.push(this.hideMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsMapquest.prototype.clearMarker = function(marker) {
      return this.removeFromMap(marker.serviceObject);
    };

    Gmaps4RailsMapquest.prototype.showMarker = function(marker) {};

    Gmaps4RailsMapquest.prototype.hideMarker = function(marker) {};

    Gmaps4RailsMapquest.prototype.extendBoundsWithMarkers = function() {
      var marker, _i, _len, _ref, _results;
      if (this.markers.length >= 2) {
        this.boundsObject = new MQA.RectLL(this.markers[0].serviceObject.latLng, this.markers[1].serviceObject.latLng);
        _ref = this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          _results.push(this.boundsObject.extend(marker.serviceObject.latLng));
        }
        return _results;
      }
    };

    Gmaps4RailsMapquest.prototype.createClusterer = function(markers_array) {};

    Gmaps4RailsMapquest.prototype.clearClusterer = function() {};

    Gmaps4RailsMapquest.prototype.clusterize = function() {};

    Gmaps4RailsMapquest.prototype.createInfoWindow = function(marker_container) {
      return marker_container.serviceObject.setInfoTitleHTML(marker_container.description);
    };

    Gmaps4RailsMapquest.prototype.fitBounds = function() {
      if (this.markers.length >= 2) {
        this.serviceObject.zoomToRect(this.boundsObject);
      }
      if (this.markers.length === 1) {
        return this.serviceObject.setCenter(this.markers[0].serviceObject.latLng);
      }
    };

    Gmaps4RailsMapquest.prototype.centerMapOnUser = function() {
      return this.serviceObject.setCenter(this.userLocation);
    };

    Gmaps4RailsMapquest.prototype.addToMap = function(object) {
      return this.serviceObject.addShape(object);
    };

    Gmaps4RailsMapquest.prototype.removeFromMap = function(object) {
      return this.serviceObject.removeShape(object);
    };

    Gmaps4RailsMapquest.prototype.updateBoundsWithPolylines = function() {};

    Gmaps4RailsMapquest.prototype.updateBoundsWithPolygons = function() {};

    Gmaps4RailsMapquest.prototype.updateBoundsWithCircles = function() {};

    Gmaps4RailsMapquest.prototype.extendMapBounds = function() {};

    Gmaps4RailsMapquest.prototype.adaptMapToBounds = function() {
      return this.fitBounds();
    };

    return Gmaps4RailsMapquest;

  })(Gmaps4Rails);

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
(function() {



}).call(this);