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
    return {
      point:            jasmine.createSpy('point'),
      size:             jasmine.createSpy('size'),
      circle:           jasmine.createSpy('circle'),
      latLng:           jasmine.createSpy('latLng'),
      latLngBounds:     jasmine.createSpy('latLngBounds'),
      map:              jasmine.createSpy('map'),
      mapTypes:         jasmine.createSpy('mapTypes'),
      markerImage:      jasmine.createSpy('markerImage'),
      marker:           jasmine.createSpy('marker'),
      infowindow:       jasmine.createSpy('infowindow'),
      addListener:      jasmine.createSpy('addListener'),
      clusterer:        jasmine.createSpy('clusterer'),
      addListenerOnce:  jasmine.createSpy('addListenerOnce'),
      polyline:         jasmine.createSpy('polyline'),
      polygon:          jasmine.createSpy('polygon'),
      kml:              jasmine.createSpy('kml')
    };
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

          MarkerBuilder.prototype.OBJECT = Gmaps.Google.Objects.Marker;

          MarkerBuilder.prototype.PRIMITIVES = Gmaps.Primitives(primitives);

          return MarkerBuilder;

        })(Gmaps.Google.Builders.Marker);
      }
    }
  }
};

window.spec_helpers = spec_helpers;
