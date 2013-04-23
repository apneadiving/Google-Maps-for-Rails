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
