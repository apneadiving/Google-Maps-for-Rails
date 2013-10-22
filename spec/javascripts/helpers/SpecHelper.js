spec_helpers = {

  createHandlersSpies: function(){
    Gmaps.Specs = {
      spies:    {
        Builders: {}
      },
      Objects:  {},
      Builders: {}
    };

    classes = ['Bound', 'Circle', 'Map', 'Marker', 'Polyline', 'Polygon', 'Kml', 'Clusterer' ];

    _.each(classes, function(klass_name){
      Gmaps.Specs.Objects[klass_name] = function(){};

      Gmaps.Specs.spies.Builders[klass_name] = jasmine.createSpy(klass_name + ' build');

      Gmaps.Specs.Builders[klass_name] = function(){
        return {
          build: function() {
           return Gmaps.Specs.spies.Builders[klass_name];
          }
        }
      };

      spyOn(Gmaps.Specs.Builders, klass_name).andCallThrough();
    })
  },
  override_primitives: function(){
    factory = {
      point:        jasmine.createSpy('point'),
      size:         jasmine.createSpy('size'),
      circle:       jasmine.createSpy('circle'),
      latLng:       jasmine.createSpy('latLng'),
      latLngBounds: jasmine.createSpy('latLngBounds'),
      map:          jasmine.createSpy('map'),
      mapTypez:     jasmine.createSpy('mapTypes'),
      markerImage:  jasmine.createSpy('markerImage'),
      marker:       jasmine.createSpy('marker'),
      infowindow:   jasmine.createSpy('infowindow'),
      listener:     jasmine.createSpy('addListener'),
      clusterer:    jasmine.createSpy('clusterer'),
      listenerOnce: jasmine.createSpy('addListenerOnce'),
      polyline:     jasmine.createSpy('polyline'),
      polygon:      jasmine.createSpy('polygon'),
      kml:          jasmine.createSpy('kml'),

      addListener: function(object, event_name, fn){
        factory.listener(object, event_name, fn);
      },
      addListenerOnce: function(object, event_name, fn){
        factory.listenerOnce(object, event_name, fn);
      },
      mapTypes: function(type){
        factory.mapTypez[type];
      },
      latLngFromPosition: function(position){
        if (_.isArray(position)){
          return new factory.latLng(position[0], position[1])
        } else {
          if (_.isNumber(position.lat) && _.isNumber(position.lng)) {
            return new factory.latLng(position.lat, position.lng)
          } else {
            return position;
          }
        }
      }
    };
    return factory;
  },

  google: {

    Builders: {
      Marker: function(primitives){
        var MarkerBuilder, _ref,
          __hasProp = {}.hasOwnProperty,
          __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

        return (function(_super) {
          __extends(MarkerBuilder, _super);

          function MarkerBuilder() {
            _ref = MarkerBuilder.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          MarkerBuilder.OBJECT = Gmaps.Google.Objects.Marker;

          MarkerBuilder.PRIMITIVES = primitives;

          return MarkerBuilder;

        })(Gmaps.Google.Builders.Marker);
      }
    }
  }
};

window.spec_helpers = spec_helpers;
