describe("Gmaps.Objects.Handler", function() {

  var subjectClass = Gmaps.Objects.Handler;
  var subject      = null;
  var builders_path  = function()    { return Gmaps.Specs.Builders; };
  var builders       = function(name){ return builders_path()[name]; };
  var stubbed_path   = function(name){ return Gmaps.Specs.spies.Builders; };
  var stubbed        = function(name){ return stubbed_path()[name]; };

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
        expect(subject.bounds).toBe(stubbed('Bound'));
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
      expect(Gmaps.Specs.Builders.Map).toHaveBeenCalledWith(options, jasmine.any(Function), undefined)
      expect(subject.map).toBe(stubbed('Map'));
    });
  });

  describe("with map", function() {
    var map;

    var assign_stubbed_map = function() {
      map = jasmine.createSpy('map');
      spyOn(subject, 'getMap').andReturn(map);
    };

    describe("add collection", function() {

      var object_data, objects_data, provider_options;

      beforeEach(function() {
        object_data  = jasmine.createSpy('object_data');
        objects_data = [object_data];
        provider_options = jasmine.createSpy('provider_options');
        build_subject();
        assign_stubbed_map();
      });

      describe("addMarkers", function() {
        it("loops and delegates to addMarker", function() {
          spyOn(subject, 'addMarker');
          subject.addMarkers(objects_data, provider_options);
          expect(subject.addMarker).toHaveBeenCalledWith(object_data, provider_options);
        });
      });

      describe("addCircles", function() {
        it("loops and delegates to addCircle", function() {
          spyOn(subject, 'addCircle');
          subject.addCircles(objects_data, provider_options);
          expect(subject.addCircle).toHaveBeenCalledWith(object_data, provider_options);
        });
      });

      describe("addPolylines", function() {
        it("loops and delegates to addPolyline", function() {
          spyOn(subject, 'addPolyline');
          subject.addPolylines(objects_data, provider_options);
          expect(subject.addPolyline).toHaveBeenCalledWith(object_data, provider_options);
        });
      });

      describe("addPolygons", function() {
        it("loops and delegates to addPolygon", function() {
          spyOn(subject, 'addPolygon');
          subject.addPolygons(objects_data, provider_options);
          expect(subject.addPolygon).toHaveBeenCalledWith(object_data, provider_options);
        });
      });

      describe("addKmls", function() {
        it("loops and delegates to addKml", function() {
          spyOn(subject, 'addKml');
          subject.addKmls(objects_data, provider_options);
          expect(subject.addKml).toHaveBeenCalledWith(object_data, provider_options);
        });
      });
    });

    describe("add single item", function() {
      var object, object_data, provider_options, builder_spy;

      var create_context = function(name){
        stubbed_path()[name] = object;
        builder_spy          = builders(name);

        build_subject();
        assign_stubbed_map();
      };

      beforeEach(function() {
        object           = jasmine.createSpyObj('object', ['associate_to_map']);
        object_data      = jasmine.createSpy('object_data');
        provider_options = jasmine.createSpy('provider_options');
      });

      describe("addMarker", function() {
        var clusterer;

        beforeEach(function() {
          clusterer = jasmine.createSpyObj('clusterer', ['addMarker']);
          create_context('Marker');
          subject.clusterer = clusterer;
        });

        it("delegates marker creation to builder", function() {
          var result = subject.addMarker(object_data, provider_options);
          expect(builder_spy).toHaveBeenCalledWith(object_data, provider_options, subject.marker_options);
        });

        it("associate map to Marker", function() {
          subject.addMarker(object_data, provider_options);

          expect(object.associate_to_map).toHaveBeenCalledWith(map);
        });

        it("clusterer receives marker", function() {
          subject.addMarker(object_data, provider_options);

          expect(clusterer.addMarker).toHaveBeenCalledWith(object);
        });

        it("returns marker", function() {
          var result = subject.addMarker(object_data, provider_options);

          expect(result).toBe(object);
        });
      });

      describe("addCircle", function() {
        beforeEach(function() {
          create_context('Circle');
        });

        it("delegates circle creation to builder", function() {
          subject.addCircle(object_data, provider_options);

          expect(builder_spy).toHaveBeenCalledWith(object_data, provider_options, undefined);
        });

        it("associate map to circle", function() {
          subject.addCircle(object_data, provider_options);

          expect(object.associate_to_map).toHaveBeenCalledWith(map);
        });

        it("returns circle", function() {
          var result = subject.addCircle(object_data, provider_options);

          expect(result).toBe(object);
        });
      });

      describe("addPolyline", function() {
        beforeEach(function() {
          create_context('Polyline');
        });

        it("delegates polyline creation to builder", function() {
          subject.addPolyline(object_data, provider_options);

          expect(builder_spy).toHaveBeenCalledWith(object_data, provider_options, undefined);
        });

        it("associate map to polyline", function() {
          subject.addPolyline(object_data, provider_options);

          expect(object.associate_to_map).toHaveBeenCalledWith(map);
        });

        it("returns polyline", function() {
          var result = subject.addPolyline(object_data, provider_options);

          expect(result).toBe(object);
        });
      });

      describe("addPolygon", function() {
        beforeEach(function() {
          create_context('Polygon');
        });

        it("delegates polygon creation to builder", function() {
          subject.addPolygon(object_data, provider_options);

          expect(builder_spy).toHaveBeenCalledWith(object_data, provider_options, undefined);
        });

        it("associate map to polygon", function() {
          subject.addPolygon(object_data, provider_options);

          expect(object.associate_to_map).toHaveBeenCalledWith(map);
        });

        it("returns polygon", function() {
          var result = subject.addPolygon(object_data, provider_options);

          expect(result).toBe(object);
        });
      });

      describe("addKml", function() {
        beforeEach(function() {
          create_context('Kml');
        });

        it("delegates kml creation to builder", function() {
          subject.addKml(object_data, provider_options);

          expect(builder_spy).toHaveBeenCalledWith(object_data, provider_options, undefined);
        });

        it("associate map to kml", function() {
          subject.addKml(object_data, provider_options);

          expect(object.associate_to_map).toHaveBeenCalledWith(map);
        });

        it("returns kml", function() {
          var result = subject.addKml(object_data, provider_options);

          expect(result).toBe(object);
        });
      });
    });
  });

});
