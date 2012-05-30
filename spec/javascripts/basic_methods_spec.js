var gmap;

beforeEach(function() {
  gmap = new Gmaps4RailsGoogle();
});
 
describe("Gmaps4Rails", function() {

  describe("Basic methods", function() {
    
    describe("exists", function() {
      it("should render true for valid cases", function() {
        var test = { "ok": "I exist", "null": null}
        fake_array = [];
        expect(gmap.exists(test.ok)).toBeTruthy();
        expect(gmap.exists(test.null)).toBeTruthy();
        expect(gmap.exists(fake_array)).toBeTruthy();
      });
      it("should render false for invalid cases", function() {
        var test = { "empty": ""};
        expect(gmap.exists(test.empty)).toBeFalsy();
        expect(gmap.exists(test.unknown)).toBeFalsy();
      });
    });
    
    describe("merges", function() {
      
      beforeEach(function() {
        this.default_obj = {
          foo: 1,
          bar: 1
        };
        this.obj = {
          bar: 2,
          baz: 3
        };
        this.expected_result = {  
           foo: 1,
           bar: 2,
           baz: 3
        }; 
      });

      
      describe("mergeWithDefault", function() {
        it("should merge default_object within object", function() {
          gmap.default_foo = this.default_obj;
          gmap.foo = this.obj;
          expect(gmap.mergeWithDefault("foo")).toBeTruthy();
          expect(gmap.foo).toEqual(this.expected_result);
        });
      });
    
      describe("mergeObjectWithDefault", function() {
        it("should return proper values without changing actual objects", function() {
          var copy_default = this.default_obj;
          var copy_obj = this.obj;
          var result = gmap.mergeObjectWithDefault(copy_obj, copy_default);
          expect(result).toEqual(this.expected_result);
          expect(this.obj).toEqual(copy_obj);
          expect(this.default_obj).toEqual(copy_default);
        });
      });
    });


    describe("random", function() {
      it("should return a number between between -1 and 1", function() {
        for (var i = 0; i < 100; ++i) {
          var x = gmap.random();
          expect(x).toBeLessThan(1);
          expect(x).toBeGreaterThan(-1);
        }
      });
    });
    
    describe("randomize", function() {
      it("should alter coordinates within a determined radius", function() {
        gmap.markers_conf.max_random_distance = 100;
        for (var i = 0; i < 100; ++i) {
          var x = gmap.randomize(0,0);
          var distanceInMeters = geoHelpers.getDistanceFromO(x[0], x[1])/1000;
          //this test could seem weird, but because latitude AND longitude could be moved by 100m, the highest diagonal is 142m
          expect(distanceInMeters).toBeLessThan(142);
        }
      });
    });	
  });
});

describe("Gmaps", function() {
  
  it("should initialize all requested maps", function() {
    Gmaps.load_test1 = jasmine.createSpy('myStub');
    Gmaps.load_test2 = jasmine.createSpy('myStub');
    Gmaps.test1 = true;
    Gmaps.test2 = true; 
    Gmaps.loadMaps();
    expect(Gmaps.load_test1).toHaveBeenCalled();
    expect(Gmaps.load_test2).toHaveBeenCalled();
  });
  
});