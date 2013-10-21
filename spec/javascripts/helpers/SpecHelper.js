window.createSpies = function(){

  Gmaps.Specs = {
    Objects:  {},
    spies: {
      Builders: {
        Bound:     jasmine.createSpy('bound build'),
        Map:       jasmine.createSpy('map build'),
        Marker:    jasmine.createSpy('marker build'),
        Clusterer: jasmine.createSpy('clusterer build')
      }
    }
  };

  Gmaps.Specs.Builders = {
    Bound:     function() { return { build: Gmaps.Specs.spies.Builders.Bound     }; },
    Map:       function() { return { build: Gmaps.Specs.spies.Builders.Map       }; },
    Marker:    function() { return { build: Gmaps.Specs.spies.Builders.Marker    }; },
    Clusterer: function() { return { build: Gmaps.Specs.spies.Builders.Clusterer }; }
  };

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
