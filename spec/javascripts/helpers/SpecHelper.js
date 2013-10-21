window.createSpies = function(){

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
  });

  Specs = {

    override_primitives: {
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
    }

  };
};
