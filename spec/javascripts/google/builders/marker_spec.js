describe("Gmaps.Google.Builders.Marker", function() {

  var subject_klass, instance, primitives;

  beforeEach(function() {
    primitives    = spec_helpers.override_primitives();
    subject_klass = spec_helpers.google.Builders.Marker(primitives);
  });

  describe("constructor", function() {
    var serviceObject, infowindow;
    beforeEach(function() {
      spyOn(subject_klass.prototype, 'create_marker');
      spyOn(subject_klass.prototype, 'create_infowindow_on_click');
    });

    it("sets vars", function() {
      instance = new subject_klass();
      expect(subject_klass.prototype.create_marker).toHaveBeenCalled();
      expect(subject_klass.prototype.create_infowindow_on_click).toHaveBeenCalled();
    });

    describe("marker_options", function() {
      describe("coordinates", function() {
        var args = { lat: 40, lng: 42};

        it("only coordinates, without randomization", function() {
          instance = new subject_klass(args, {}, {});

          instance.marker_options();

          expect(primitives.latLng).toHaveBeenCalledWith(args.lat, args.lng);
        });

        it("only coordinates, with randomization", function() {
          instance = new subject_klass(args, {}, { maxRandomDistance: 12 });

          instance.marker_options();

          expect(primitives.latLng).not.toHaveBeenCalledWith(args.lat, args.lng);

          called_lat = primitives.latLng.mostRecentCall.args[0];
          called_lng = primitives.latLng.mostRecentCall.args[1];

          expect(called_lat).toBeWithinOf(args.lat, 0.00011);
          expect(called_lng).toBeWithinOf(args.lng, 0.00011);
        });
      });

      describe("title", function() {
        it("without title", function() {
          instance = new subject_klass({}, {}, {});

          var result = instance.marker_options();

          expect(result.title).toBeUndefined();
        });

        it("with title", function() {
          instance = new subject_klass({marker_title: 'title'}, {}, { maxRandomDistance: 12 });

          var result = instance.marker_options();

          expect(result.title).toEqual('title');
        });
      });

      describe("merge with provider options", function() {
        it("no provider options", function() {
          instance = new subject_klass({}, {}, {});

          var result = instance.marker_options();

          expect(result.zIndex).toBeUndefined();
        });

        it("provider options", function() {
          instance = new subject_klass({}, { zIndex: 'zIndex'}, { maxRandomDistance: 12 });

          var result = instance.marker_options();

          expect(result.zIndex).toEqual('zIndex');
        });

        it("provider options with overlapping keys", function() {
          instance = new subject_klass({marker_title: 'arg_title'}, { title: 'provider_title'}, { maxRandomDistance: 12 });

          var result = instance.marker_options();

          expect(result.title).toEqual('arg_title');
        });
      });
    });
  });

});
