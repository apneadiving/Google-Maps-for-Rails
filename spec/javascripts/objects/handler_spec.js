describe("Gmaps.Objects.Handler", function() {

  var subjectClass = Gmaps.Objects.Handler;
  var subject      = null;
  var builders_path  = function()    { return Gmaps.Specs.spies.Builders; };
  var builders       = function(name){ return builders_path()[name]; };

  var build_subject = function() {
    subject = new subjectClass('Specs', { primitives: Specs.override_primitives });
  };

  beforeEach(function() {
    createSpies();
  });

  it("function exists", function() {
    expect(typeof subjectClass).toBe('function');
  });

  describe("constructor", function() {
    beforeEach(function() {
      build_subject();
    });

    describe("primitives setter", function() {
      it("uses expected primitives", function() {
        new subject.primitives.point();
        expect(Specs.override_primitives.point).toHaveBeenCalled();
      });
    });

    describe("options setter", function() {
      it("default", function() {
        expect(_.isEqual(subject.builders,       subject._default_builders())).toBeTruthy();
        expect(_.isEqual(subject.models,         subject._default_models())).toBeTruthy();
        expect(_.isEqual(subject.marker_options, subject._default_marker_options())).toBeTruthy();
      });

      it("redefines builders", function() {
        var MarkerBuilder = function(){};
        subject = new subjectClass('Specs', {  primitives: Specs.override_primitives, builders: { Marker: MarkerBuilder } });
        expect(subject.builders.Marker).toBe(MarkerBuilder);
      });

      it("redefines models", function() {
        var MarkerModel = function(){};
        subject = new subjectClass('Specs', {  primitives: Specs.override_primitives, models: { Marker: MarkerModel } });
        expect(subject.models.Marker).toBe(MarkerModel);
      });

      it("redefines marker_options", function() {
        var marker_options = { foo: 1 };
        subject = new subjectClass('Specs', {  primitives: Specs.override_primitives, markers: marker_options });
        expect(subject.marker_options.foo).toBe(marker_options.foo);
      });

      it("Clusterer: default model if clusterer required", function() {
        subject = new subjectClass('Specs', {
          primitives: Specs.override_primitives,
          markers: { clusterer: {} }
        });
        expect(subject.models.Clusterer).not.toBe(Gmaps.Objects.NullClusterer);
      });

      it("Clusterer: null clusterer if no clusterer required", function() {
        subject = new subjectClass('Specs', {
          primitives: Specs.override_primitives,
          markers:   { clusterer: null }
        });
        expect(subject.models.Clusterer).toBe(Gmaps.Objects.NullClusterer);
      });

      it("creates bounds", function() {
        expect(builders('Bound')).toHaveBeenCalled();
      });
    });
  });

  describe("buildMap", function() {
    beforeEach(function() {
      build_subject();
    });

    it("delegates to builder", function() {
      var options   = jasmine.createSpy('options');
      var onMapLoad = function(){};
      subject.buildMap(options, onMapLoad);

      expect(builders('Map')).toHaveBeenCalledWith(options, jasmine.any(Function));
    });
  });

  describe("with map", function() {
    var map;

    var assign_stubbed_map = function() {
      map = jasmine.createSpy('map');
      spyOn(subject, 'getMap').andReturn(map);
    };

    describe("addMarkers", function() {

      beforeEach(function() {
       build_subject();
       assign_stubbed_map();
      });

      var marker_data  = jasmine.createSpy('marker_data');
      var markers_data = [marker_data];
      var provider_options = jasmine.createSpy('provider_options');

      it("loops and delegates to addMarker", function() {
        spyOn(subject, 'addMarker');
        subject.addMarkers(markers_data, provider_options);
        expect(subject.addMarker).toHaveBeenCalledWith(marker_data, provider_options);
      });
    });

    describe("addMarker", function() {
      var marker_data, provider_options, marker, clusterer, builder_spy;

      beforeEach(function() {
        marker_data      = jasmine.createSpy('marker_data');
        provider_options = jasmine.createSpy('provider_options');
        marker           = jasmine.createSpyObj('marker', ['associate_to_map']);
        clusterer        = jasmine.createSpyObj('clusterer', ['addMarker']);
        builders('Marker').isSpy = false;
        builder_spy       = spyOn(builders_path(), 'Marker').andReturn(marker);

        build_subject();
        assign_stubbed_map();
        subject.clusterer = clusterer;
      });

      it("delegates marker creation to builder", function() {
        subject.addMarker(marker_data, provider_options);

        expect(builder_spy).toHaveBeenCalledWith(marker_data, provider_options, subject.marker_options);
      });

      it("associate map to Marker", function() {
        subject.addMarker(marker_data, provider_options);

        expect(marker.associate_to_map).toHaveBeenCalledWith(map);
      });

      it("clusterer receives marker", function() {
        subject.addMarker(marker_data, provider_options);

        expect(clusterer.addMarker).toHaveBeenCalledWith(marker);
      });
    });
  });
});
