beforeEach(function() {
  var gmap = new Gmaps4RailsGoogle();
});

describe("Mocks Fake", function() {
  it("should create fake Point", function() {
    expect(gmap.createPoint(1,2)).toEqual([1,2]);
  });
  it("should create fake LatLng", function() {
    expect(gmap.createLatLng(1,2)).toEqual([1,2]);
  });
  it("should create fake LatLngBounds", function() {
    expect(gmap.createLatLngBounds()).toEqual([]);
  });
  it("should create fake Map", function() {
    expect(gmap.createMap()).toEqual({ "who": "I'm map"});
  });  
  it("should create fake MarkerImage", function() {
    expect(gmap.createMarkerImage("pic", "size", "url", "anchor", "scale")).toEqual({"who": "Point", "picture": "pic", "size": "size", "url": "url", "anchor": "anchor", "scale": "scale"});
  });
  it("should create fake Size", function() {
    expect(gmap.createSize(1, 3)).toEqual([1,3]);
  });
  it("should create fake Clusterer", function() {
    expect(gmap.createClusterer()).toEqual({ "who": "I'm Clusterer" });
  });
});