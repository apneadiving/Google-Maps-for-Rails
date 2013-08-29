(function() {
  Gmaps4Rails.Yandex = {};

  Gmaps4Rails.Yandex.Shared = {
    createPoint: function(lat, lng) {
      return [lat, lng];
    },
    createLatLng: function(lat, lng) {
      return [lat, lng];
    },
    createLatLngBounds: function() {},
    createSize: function(width, height) {
      return [width, height];
    },
    _addToMap: function(object) {
      return this.controller.getMapObject().geoObjects.add(object);
    },
    _removeFromMap: function(object) {
      return this.controller.getMapObject().geoObjects.remove(object);
    }
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4Rails.Yandex.Map = (function(_super) {
    __extends(Map, _super);

    Map.include(Gmaps4Rails.Interfaces.Map);

    Map.include(Gmaps4Rails.Map);

    Map.include(Gmaps4Rails.Yandex.Shared);

    Map.include(Gmaps4Rails.Configuration);

    Map.prototype.CONF = {
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      type: "yandex#map",
      mapTypeControl: null
    };

    function Map(map_options, controller) {
      var defaultOptions, mergedYandexOptions, yandexOptions;

      this.controller = controller;
      defaultOptions = this.setConf();
      this.options = this.mergeObjects(map_options, defaultOptions);
      yandexOptions = {
        center: this.createLatLng(this.options.center_latitude, this.options.center_longitude),
        zoom: this.options.zoom,
        type: this.options.type
      };
      mergedYandexOptions = this.mergeObjects(map_options.raw, yandexOptions);
      this.serviceObject = new ymaps.Map(this.options.id, mergedYandexOptions);
    }

    Map.prototype.extendBoundsWithMarkers = function() {
      return this.boundsObject = this.serviceObject.geoObjects.getBounds();
    };

    Map.prototype.extendBoundsWithPolyline = function(polyline) {};

    Map.prototype.extendBoundsWithPolygon = function(polygon) {};

    Map.prototype.extendBoundsWithCircle = function(circle) {};

    Map.prototype.extendBound = function(bound) {};

    Map.prototype.fitBounds = function() {
      if (this.boundsObject != null) {
        return this.serviceObject.setBounds(this.boundsObject);
      }
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

  this.Gmaps4Rails.Yandex.Marker = (function(_super) {
    __extends(Marker, _super);

    Marker.include(Gmaps4Rails.Interfaces.Marker);

    Marker.include(Gmaps4Rails.Yandex.Shared);

    Marker.include(Gmaps4Rails.Marker.Instance);

    Marker.extend(Gmaps4Rails.Marker.Class);

    Marker.extend(Gmaps4Rails.Configuration);

    function Marker(args, controller) {
      var markerLatLng;

      this.controller = controller;
      markerLatLng = this.createLatLng(args.lat, args.lng);
      this.style_mark = {};
      if (args.marker_picture != null) {
        this._styleForCustomMarker(args);
      }
      this.serviceObject = new ymaps.Placemark(markerLatLng, {
        balloonContent: this.description,
        iconContent: args.marker_title
      }, this.style_mark);
      this._addToMap(this.serviceObject);
    }

    Marker.prototype.isVisible = function() {
      return true;
    };

    Marker.prototype.clear = function() {
      return this._removeFromMap(this.serviceObject);
    };

    Marker.prototype.show = function() {
      return this.serviceObject.options.set("visible", true);
    };

    Marker.prototype.hide = function() {
      return this.serviceObject.options.set("visible", false);
    };

    Marker.prototype.createInfoWindow = function() {
      if (this.description != null) {
        return this.serviceObject.properties.set("balloonContent", this.description);
      }
    };

    Marker.prototype._styleForCustomMarker = function(args) {
      this.style_mark.iconImageHref = args.marker_picture;
      this.style_mark.iconImageSize = [args.marker_width, args.marker_height];
      if (args.marker_anchor != null) {
        this.style_mark.iconImageOffset = args.marker_anchor;
      }
      if (args.shadow_picture != null) {
        this.style_mark.iconShadow = true;
        this.style_mark.iconShadowImageHref = args.shadow_picture;
        this.style_mark.iconShadowImageSize = [args.shadow_width, args.shadow_height];
        if ((args.shadow_width != null) && (args.shadow_height != null)) {
          this.style_mark.iconShadowOffset = [args.shadow_width, args.shadow_height];
        }
        if (args.shadow_anchor != null) {
          return this.style_mark.iconShadowOffset = args.shadow_anchor;
        }
      }
    };

    return Marker;

  })(Gmaps4Rails.Common);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsYandex = (function(_super) {
    __extends(Gmaps4RailsYandex, _super);

    Gmaps4RailsYandex.include(Gmaps4Rails.Yandex.Shared);

    function Gmaps4RailsYandex() {
      Gmaps4RailsYandex.__super__.constructor.apply(this, arguments);
    }

    Gmaps4RailsYandex.prototype.getModule = function() {
      return Gmaps4Rails.Yandex;
    };

    Gmaps4RailsYandex.prototype.createClusterer = function(marker_serviceObject_array) {};

    Gmaps4RailsYandex.prototype.clearClusterer = function() {};

    Gmaps4RailsYandex.prototype.findUserLocation = function(controller, center_on_user) {
      controller.userLocation = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
      if (center_on_user) {
        return controller.map.centerMapOnUser(controller.userLocation);
      }
    };

    return Gmaps4RailsYandex;

  })(Gmaps4Rails.BaseController);

}).call(this);
(function() {


}).call(this);
