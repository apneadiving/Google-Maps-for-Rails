describe("Gmaps4Rails", function() {

  describe("Basic methods", function() {
    
    describe("exists", function() {
      it("should render true for valid cases", function() {
        var test = { "ok": "I exist", "null": null}
        fake_array = [];
        expect(Gmaps4Rails.exists(test.ok)).toBeTruthy();
        expect(Gmaps4Rails.exists(test.null)).toBeTruthy();
        expect(Gmaps4Rails.exists(fake_array)).toBeTruthy();
      });
      it("should render false for invalid cases", function() {
        var test = { "empty": ""};
        expect(Gmaps4Rails.exists(test.empty)).toBeFalsy();
        expect(Gmaps4Rails.exists(test.unknown)).toBeFalsy();
      });
    });

    describe("random", function() {
      it("should return a number between between -1 and 1", function() {
        for (var i = 0; i < 100; ++i) {
          var x = Gmaps4Rails.random();
          expect(x).toBeLessThan(1);
          expect(x).toBeGreaterThan(-1);
        }
      });
    });
    
    describe("randomize", function() {
      it("should alter coordinates within a determined radius", function() {
        Gmaps4Rails.markers_conf.max_random_distance = 100;
        for (var i = 0; i < 100; ++i) {
          var x = Gmaps4Rails.randomize(0,0);
          var distanceInMeters = geoHelpers.getDistanceFromO(x[0], x[1])/1000;
          //this test coul seem weird, but because latitude AND longitude could be moved by 100m, the highest diagonal is 142m
          expect(distanceInMeters).toBeLessThan(142);
        }
      });
    });	
  });
});