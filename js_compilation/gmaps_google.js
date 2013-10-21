(function() {
  this.Gmaps = {
    build: function(type, options) {
      var model;
      if (options == null) {
        options = {};
      }
      model = _.isObject(options.handler) ? options.handler : Gmaps.Objects.Handler;
      return new model(type, options);
    },
    Builders: {},
    Objects: {},
    Google: {
      Objects: {},
      Builders: {}
    }
  };

}).call(this);
(function() {
  var moduleKeywords,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moduleKeywords = ['extended', 'included'];

  this.Gmaps.Base = (function() {
    function Base() {}

    Base.extend = function(obj) {
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

    Base.include = function(obj) {
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

    return Base;

  })();

}).call(this);
(function() {
  this.Gmaps.Primitives = function(primitives) {
    var delegator;
    delegator = function(klass, args) {
      var F;
      F = function(args) {
        return klass.apply(this, args);
      };
      F.prototype = klass.prototype;
      return new F(args);
    };
    return {
      point: function() {
        return delegator(primitives.point, arguments);
      },
      polyline: function() {
        return delegator(primitives.polyline, arguments);
      },
      polygon: function() {
        return delegator(primitives.polygon, arguments);
      },
      size: function() {
        return delegator(primitives.size, arguments);
      },
      latLng: function() {
        return delegator(primitives.latLng, arguments);
      },
      latLngBounds: function() {
        return delegator(primitives.latLngBounds, arguments);
      },
      map: function() {
        return delegator(primitives.map, arguments);
      },
      circle: function() {
        return delegator(primitives.circle, arguments);
      },
      mapTypes: function(type) {
        return primitives.mapTypes[type];
      },
      addListener: function(object, event_name, fn) {
        return primitives.addListener(object, event_name, fn);
      },
      addListenerOnce: function(object, event_name, fn) {
        return primitives.addListenerOnce(object, event_name, fn);
      },
      marker: function() {
        return delegator(primitives.marker, arguments);
      },
      markerImage: function() {
        return delegator(primitives.markerImage, arguments);
      },
      infowindow: function() {
        return delegator(primitives.infowindow, arguments);
      },
      clusterer: function() {
        return delegator(primitives.clusterer, arguments);
      },
      kml: function() {
        return delegator(primitives.kml, arguments);
      },
      latLngFromPosition: function(position) {
        if (_.isArray(position)) {
          return new primitives.latLng(position[0], position[1]);
        } else {
          if (_.isNumber(position.lat) && _.isNumber(position.lng)) {
            return new primitives.latLng(position.lat, position.lng);
          } else {
            return position;
          }
        }
      }
    };
  };

}).call(this);
(function() {
  this.Gmaps.Objects.BaseBuilder = (function() {
    function BaseBuilder() {}

    BaseBuilder.prototype.build = function() {
      return new this.OBJECT(this.serviceObject);
    };

    BaseBuilder.prototype.addListener = function(action, fn) {
      return this.PRIMITIVES.addListener(this.getServiceObject(), action, fn);
    };

    BaseBuilder.prototype.getServiceObject = function() {
      return this.serviceObject;
    };

    return BaseBuilder;

  })();

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Objects.Builders = function(builderClass, objectClass, primitivesProvider) {
    var Builder, _ref;
    Builder = (function(_super) {
      __extends(Builder, _super);

      function Builder() {
        _ref = Builder.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Builder.prototype.OBJECT = objectClass;

      Builder.prototype.PRIMITIVES = primitivesProvider;

      return Builder;

    })(builderClass);
    return {
      build: function(args, provider_options, internal_options) {
        return new Builder(args, provider_options, internal_options).build();
      }
    };
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Gmaps.Objects.Handler = (function() {
    function Handler(type, options) {
      this.type = type;
      if (options == null) {
        options = {};
      }
      this._createClusterer = __bind(this._createClusterer, this);
      this.getMap = __bind(this.getMap, this);
      this.addKml = __bind(this.addKml, this);
      this.addKmls = __bind(this.addKmls, this);
      this.addPolygon = __bind(this.addPolygon, this);
      this.addPolygons = __bind(this.addPolygons, this);
      this.addPolyline = __bind(this.addPolyline, this);
      this.addPolylines = __bind(this.addPolylines, this);
      this.addCircle = __bind(this.addCircle, this);
      this.addCircles = __bind(this.addCircles, this);
      this.addMarker = __bind(this.addMarker, this);
      this.addMarkers = __bind(this.addMarkers, this);
      this.buildMap = __bind(this.buildMap, this);
      this.setPrimitives(options);
      this.setOptions(options);
      this.resetBounds();
    }

    Handler.prototype.buildMap = function(options, onMapLoad) {
      var _this = this;
      if (onMapLoad == null) {
        onMapLoad = function() {};
      }
      return this.map = this._map_builder().build(options, function() {
        _this._createClusterer();
        return onMapLoad();
      });
    };

    Handler.prototype.addMarkers = function(markers_data, provider_options) {
      var _this = this;
      return _.map(markers_data, function(marker_data) {
        return _this.addMarker(marker_data, provider_options);
      });
    };

    Handler.prototype.addMarker = function(marker_data, provider_options) {
      var marker;
      marker = this._marker_builder().build(marker_data, provider_options, this.marker_options);
      marker.associate_to_map(this.getMap());
      this.clusterer.addMarker(marker);
      return marker;
    };

    Handler.prototype.addCircles = function(circles_data, provider_options) {
      var _this = this;
      return _.map(circles_data, function(circle_data) {
        return _this.addCircle(circle_data, provider_options);
      });
    };

    Handler.prototype.addCircle = function(circle_data, provider_options) {
      return this._addResource('circle', circle_data, provider_options);
    };

    Handler.prototype.addPolylines = function(polylines_data, provider_options) {
      var _this = this;
      return _.map(polylines_data, function(polyline_data) {
        return _this.addPolyline(polyline_data, provider_options);
      });
    };

    Handler.prototype.addPolyline = function(polyline_data, provider_options) {
      return this._addResource('polyline', polyline_data, provider_options);
    };

    Handler.prototype.addPolygons = function(polygons_data, provider_options) {
      var _this = this;
      return _.map(polygons_data, function(polygon_data) {
        return _this.addPolygon(polygon_data, provider_options);
      });
    };

    Handler.prototype.addPolygon = function(polygon_data, provider_options) {
      return this._addResource('polygon', polygon_data, provider_options);
    };

    Handler.prototype.addKmls = function(kmls_data, provider_options) {
      var _this = this;
      return _.map(kmls_data, function(kml_data) {
        return _this.addKml(kml_data, provider_options);
      });
    };

    Handler.prototype.addKml = function(kml_data, provider_options) {
      return this._addResource('kml', kml_data, provider_options);
    };

    Handler.prototype.fitMapToBounds = function() {
      return this.map.fitToBounds(this.bounds.getServiceObject());
    };

    Handler.prototype.getMap = function() {
      return this.map.getServiceObject();
    };

    Handler.prototype.setOptions = function(options) {
      this.marker_options = _.extend(this._default_marker_options(), options.markers);
      this.builders = _.extend(this._default_builders(), options.builders);
      return this.models = _.extend(this._default_models(), options.models);
    };

    Handler.prototype.resetBounds = function() {
      return this.bounds = this._bound_builder().build();
    };

    Handler.prototype.setPrimitives = function(options) {
      var source;
      source = options.primitives === void 0 ? this._rootModule().Primitives() : _.isFunction(options.primitives) ? options.primitives() : options.primitives;
      return this.primitives = Gmaps.Primitives(source);
    };

    Handler.prototype._addResource = function(resource_name, resource_data, provider_options) {
      var resource;
      resource = this["_" + resource_name + "_builder"]().build(resource_data, provider_options);
      resource.associate_to_map(this.getMap());
      return resource;
    };

    Handler.prototype._clusterize = function() {
      return _.isObject(this.marker_options.clusterer);
    };

    Handler.prototype._createClusterer = function() {
      return this.clusterer = this._clusterer_builder().build({
        map: this.getMap()
      }, this.marker_options.clusterer);
    };

    Handler.prototype._default_marker_options = function() {
      return {
        singleInfowindow: true,
        maxRandomDistance: 100,
        clusterer: {
          maxZoom: 5,
          gridSize: 50
        }
      };
    };

    Handler.prototype._bound_builder = function() {
      return this._builder('Bound');
    };

    Handler.prototype._clusterer_builder = function() {
      return this._builder('Clusterer');
    };

    Handler.prototype._marker_builder = function() {
      return this._builder('Marker');
    };

    Handler.prototype._map_builder = function() {
      return this._builder('Map');
    };

    Handler.prototype._kml_builder = function() {
      return this._builder('Kml');
    };

    Handler.prototype._circle_builder = function() {
      return this._builder('Circle');
    };

    Handler.prototype._polyline_builder = function() {
      return this._builder('Polyline');
    };

    Handler.prototype._polygon_builder = function() {
      return this._builder('Polygon');
    };

    Handler.prototype._builder = function(name) {
      var _name;
      if (this[_name = "__builder" + name] == null) {
        this[_name] = Gmaps.Objects.Builders(this.builders[name], this.models[name], this.primitives);
      }
      return this["__builder" + name];
    };

    Handler.prototype._default_models = function() {
      var models;
      models = this._rootModule().Objects;
      if (this._clusterize()) {
        return models;
      } else {
        models.Clusterer = Gmaps.Objects.NullClusterer;
        return models;
      }
    };

    Handler.prototype._default_builders = function() {
      return this._rootModule().Builders;
    };

    Handler.prototype._rootModule = function() {
      if (this.__rootModule == null) {
        this.__rootModule = Gmaps[this.type];
      }
      return this.__rootModule;
    };

    return Handler;

  })();

}).call(this);
(function() {
  this.Gmaps.Objects.NullClusterer = (function() {
    function NullClusterer() {}

    NullClusterer.prototype.addMarkers = function() {};

    NullClusterer.prototype.addMarker = function() {};

    NullClusterer.prototype.clear = function() {};

    return NullClusterer;

  })();

}).call(this);
(function() {
  this.Gmaps.Google.Objects.Common = {
    getServiceObject: function() {
      return this.serviceObject;
    },
    associate_to_map: function(map) {
      return this.getServiceObject().setMap(map);
    },
    clear: function() {
      this.serviceObject.setMap(null);
      return this.serviceObject = null;
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

  this.Gmaps.Google.Builders.Bound = (function(_super) {
    __extends(Bound, _super);

    function Bound(options) {
      this.serviceObject = new this.PRIMITIVES.latLngBounds();
    }

    return Bound;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Circle = (function(_super) {
    __extends(Circle, _super);

    function Circle(args, provider_options) {
      this.args = args;
      this.provider_options = provider_options != null ? provider_options : {};
      this.serviceObject = this.create_circle();
    }

    Circle.prototype.create_circle = function() {
      return new this.PRIMITIVES.circle(this.circle_options());
    };

    Circle.prototype.circle_options = function() {
      var base_options;
      base_options = {
        center: new this.PRIMITIVES.latLng(this.args.lat, this.args.lng),
        radius: this.args.radius
      };
      return _.defaults(base_options, this.provider_options);
    };

    return Circle;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Clusterer = (function(_super) {
    __extends(Clusterer, _super);

    function Clusterer(args, options) {
      this.args = args;
      this.options = options;
      this.serviceObject = new this.PRIMITIVES.clusterer(this.args.map, [], this.options);
    }

    return Clusterer;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Kml = (function(_super) {
    __extends(Kml, _super);

    function Kml(args, provider_options) {
      this.args = args;
      this.provider_options = provider_options != null ? provider_options : {};
      this.serviceObject = this.create_kml();
    }

    Kml.prototype.create_kml = function() {
      return new this.PRIMITIVES.kml(this.args.url, this.kml_options());
    };

    Kml.prototype.kml_options = function() {
      var base_options;
      base_options = {};
      return _.defaults(base_options, this.provider_options);
    };

    return Kml;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Map = (function(_super) {
    __extends(Map, _super);

    function Map(options, onMapLoad) {
      var provider_options;
      provider_options = _.extend(this.default_options(), options.provider);
      this.internal_options = options.internal;
      this.serviceObject = new this.PRIMITIVES.map(document.getElementById(this.internal_options.id), provider_options);
      this.on_map_load(onMapLoad);
    }

    Map.prototype.on_map_load = function(onMapLoad) {
      return this.PRIMITIVES.addListenerOnce(this.serviceObject, 'idle', onMapLoad);
    };

    Map.prototype.default_options = function() {
      return {
        mapTypeId: this.PRIMITIVES.mapTypes('ROADMAP'),
        center: this.PRIMITIVES.latLng(0, 0),
        zoom: 8
      };
    };

    return Map;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Marker = (function(_super) {
    __extends(Marker, _super);

    Marker.CURRENT_INFOWINDOW = null;

    Marker.prototype.CACHE_STORE = [];

    function Marker(args, provider_options, internal_options) {
      this.args = args;
      this.provider_options = provider_options != null ? provider_options : {};
      this.internal_options = internal_options != null ? internal_options : {};
      this.infowindow_binding = __bind(this.infowindow_binding, this);
      this.addInfowindowListener = __bind(this.addInfowindowListener, this);
      this.create_marker();
      this.create_infowindow();
    }

    Marker.prototype.build = function() {
      return new this.OBJECT(this.serviceObject, this.infowindow);
    };

    Marker.prototype.addInfowindowListener = function(action, fn) {
      return this.PRIMITIVES.addListener(this.infowindow, action, fn);
    };

    Marker.prototype.create_marker = function() {
      return this.serviceObject = new this.PRIMITIVES.marker(this.marker_options());
    };

    Marker.prototype.create_infowindow = function() {
      if (!_.isString(this.args.infowindow)) {
        return null;
      }
      this.infowindow = new this.PRIMITIVES.infowindow({
        content: this.args.infowindow
      });
      return this.bind_infowindow();
    };

    Marker.prototype.marker_options = function() {
      var base_options, coords;
      coords = this._randomized_coordinates();
      base_options = {
        title: this.args.marker_title,
        position: new this.PRIMITIVES.latLng(coords[0], coords[1]),
        icon: this._get_picture('picture'),
        shadow: this._get_picture('shadow')
      };
      return _.defaults(base_options, this.provider_options);
    };

    Marker.prototype.bind_infowindow = function() {
      return this.addListener('click', this.infowindow_binding);
    };

    Marker.prototype.infowindow_binding = function() {
      if (this._should_close_infowindow()) {
        this.constructor.CURRENT_INFOWINDOW.close();
      }
      this.infowindow.open(this.getServiceObject().getMap(), this.getServiceObject());
      return this.constructor.CURRENT_INFOWINDOW = this.infowindow;
    };

    Marker.prototype._get_picture = function(picture_name) {
      return this._create_or_retrieve_image(this._picture_args(picture_name));
    };

    Marker.prototype._create_or_retrieve_image = function(picture_args) {
      var existing_image;
      if (!_.isString(picture_args.url)) {
        return null;
      }
      existing_image = _.find(this.CACHE_STORE.markerImages, function(el) {
        return el.url === picture_args.url;
      });
      if (existing_image === void 0) {
        return new this.PRIMITIVES.markerImage(picture_args.url, picture_args.size, picture_args.origin, picture_args.anchor, picture_args.scaledSize);
      } else {
        return existing_image;
      }
    };

    Marker.prototype._picture_args = function(picture_name) {
      if (!_.isObject(this.args[picture_name])) {
        return {};
      }
      return {
        url: this.args[picture_name].url,
        anchor: this._createImageAnchorPosition(this.args[picture_name].anchor),
        size: new this.PRIMITIVES.size(this.args[picture_name].width, this.args[picture_name].height),
        scaledSize: null,
        origin: null
      };
    };

    Marker.prototype._createImageAnchorPosition = function(anchorLocation) {
      if (!_.isArray(anchorLocation)) {
        return null;
      }
      return new this.PRIMITIVES.point(anchorLocation[0], anchorLocation[1]);
    };

    Marker.prototype._should_close_infowindow = function() {
      return this.internal_options.singleInfowindow && (this.constructor.CURRENT_INFOWINDOW != null);
    };

    Marker.prototype._randomized_coordinates = function() {
      var Lat, Lng, dx, dy, random;
      if (!_.isNumber(this.internal_options.maxRandomDistance)) {
        return [this.args.lat, this.args.lng];
      }
      random = function() {
        return Math.random() * 2 - 1;
      };
      dx = this.internal_options.maxRandomDistance * random();
      dy = this.internal_options.maxRandomDistance * random();
      Lat = parseFloat(this.args.lat) + (180 / Math.PI) * (dy / 6378137);
      Lng = parseFloat(this.args.lng) + (90 / Math.PI) * (dx / 6378137) / Math.cos(this.args.lat);
      return [Lat, Lng];
    };

    return Marker;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Polygon = (function(_super) {
    __extends(Polygon, _super);

    function Polygon(args, provider_options) {
      this.args = args;
      this.provider_options = provider_options != null ? provider_options : {};
      this.serviceObject = this.create_polygon();
    }

    Polygon.prototype.create_polygon = function() {
      return new this.PRIMITIVES.polygon(this.polygon_options());
    };

    Polygon.prototype.polygon_options = function() {
      var base_options;
      base_options = {
        path: this._build_path()
      };
      return _.defaults(base_options, this.provider_options);
    };

    Polygon.prototype._build_path = function() {
      var _this = this;
      return _.map(this.args, function(arg) {
        return new _this.PRIMITIVES.latLng(arg.lat, arg.lng);
      });
    };

    return Polygon;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Builders.Polyline = (function(_super) {
    __extends(Polyline, _super);

    function Polyline(args, provider_options) {
      this.args = args;
      this.provider_options = provider_options != null ? provider_options : {};
      this.serviceObject = this.create_polyline();
    }

    Polyline.prototype.create_polyline = function() {
      return new this.PRIMITIVES.polyline(this.polyline_options());
    };

    Polyline.prototype.polyline_options = function() {
      var base_options;
      base_options = {
        path: this._build_path()
      };
      return _.defaults(base_options, this.provider_options);
    };

    Polyline.prototype._build_path = function() {
      var _this = this;
      return _.map(this.args, function(arg) {
        return new _this.PRIMITIVES.latLng(arg.lat, arg.lng);
      });
    };

    return Polyline;

  })(Gmaps.Objects.BaseBuilder);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Bound = (function(_super) {
    __extends(Bound, _super);

    Bound.include(Gmaps.Google.Objects.Common);

    function Bound(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Bound.prototype.extendWith = function(array_or_object) {
      var collection,
        _this = this;
      collection = _.isArray(array_or_object) ? array_or_object : [array_or_object];
      return _.each(collection, function(object) {
        return object.updateBounds(_this);
      });
    };

    Bound.prototype.extend = function(value) {
      return this.getServiceObject().extend(value);
    };

    return Bound;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Circle = (function(_super) {
    __extends(Circle, _super);

    Circle.include(Gmaps.Google.Objects.Common);

    function Circle(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Circle.prototype.updateBounds = function(bounds) {
      bounds.extend(this.getServiceObject().getBounds().getNorthEast());
      return bounds.extend(this.getServiceObject().getBounds().getSouthWest());
    };

    return Circle;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Gmaps.Google.Objects.Clusterer = (function() {
    function Clusterer(serviceObject) {
      this.serviceObject = serviceObject;
      this.clear = __bind(this.clear, this);
      this.addMarker = __bind(this.addMarker, this);
      this.addMarkers = __bind(this.addMarkers, this);
    }

    Clusterer.prototype.addMarkers = function(markers) {
      var _this = this;
      return _.each(markers, function(marker) {
        return _this.addMarker(marker);
      });
    };

    Clusterer.prototype.addMarker = function(marker) {
      return this.serviceObject.addMarker(marker.serviceObject);
    };

    Clusterer.prototype.clear = function() {
      return this.serviceObject.clearMarkers();
    };

    return Clusterer;

  })();

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Kml = (function(_super) {
    __extends(Kml, _super);

    function Kml(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Kml.prototype.updateBounds = function(bounds) {};

    return Kml;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Map = (function(_super) {
    __extends(Map, _super);

    function Map(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Map.prototype.getServiceObject = function() {
      return this.serviceObject;
    };

    Map.prototype.centerOn = function(position) {
      return this.getServiceObject().setCenter(this.PRIMITIVES.latLngFromPosition(position));
    };

    Map.prototype.fitToBounds = function(boundsObject) {
      if (!boundsObject.isEmpty()) {
        return this.getServiceObject().fitBounds(boundsObject);
      }
    };

    return Map;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Marker = (function(_super) {
    __extends(Marker, _super);

    Marker.include(Gmaps.Google.Objects.Common);

    function Marker(serviceObject, infowindow) {
      this.serviceObject = serviceObject;
      this.infowindow = infowindow;
    }

    Marker.prototype.updateBounds = function(bounds) {
      return bounds.extend(this.getServiceObject().position);
    };

    return Marker;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Polygon = (function(_super) {
    __extends(Polygon, _super);

    Polygon.include(Gmaps.Google.Objects.Common);

    function Polygon(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Polygon.prototype.updateBounds = function(bounds) {};

    return Polygon;

  })(Gmaps.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps.Google.Objects.Polyline = (function(_super) {
    __extends(Polyline, _super);

    Polyline.include(Gmaps.Google.Objects.Common);

    function Polyline(serviceObject) {
      this.serviceObject = serviceObject;
    }

    Polyline.prototype.updateBounds = function(bounds) {};

    return Polyline;

  })(Gmaps.Base);

}).call(this);
(function() {
  this.Gmaps.Google.Primitives = function() {
    return {
      point: google.maps.Point,
      size: google.maps.Size,
      circle: google.maps.Circle,
      latLng: google.maps.LatLng,
      latLngBounds: google.maps.LatLngBounds,
      map: google.maps.Map,
      mapTypes: google.maps.MapTypeId,
      markerImage: google.maps.MarkerImage,
      marker: google.maps.Marker,
      infowindow: google.maps.InfoWindow,
      addListener: google.maps.event.addListener,
      clusterer: MarkerClusterer,
      addListenerOnce: google.maps.event.addListenerOnce,
      polyline: google.maps.Polyline,
      polygon: google.maps.Polygon,
      kml: google.maps.KmlLayer
    };
  };

}).call(this);
(function() {


}).call(this);
