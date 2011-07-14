describe("Mocks Fake", function() {
  it("should create fake Point", function() {
    expect(Gmaps4Rails.createPoint(1,2)).toEqual([1,2]);
  });
  it("should create fake LatLng", function() {
    expect(Gmaps4Rails.createLatLng(1,2)).toEqual([1,2]);
  });
  it("should create fake LatLngBounds", function() {
    expect(Gmaps4Rails.createLatLngBounds()).toEqual([]);
  });
  it("should create fake Map", function() {
    expect(Gmaps4Rails.createMap()).toEqual({ "who": "I'm map"});
  });  
  it("should create fake MarkerImage", function() {
    expect(Gmaps4Rails.createMarkerImage("pic", "size", "url", "anchor", "scale")).toEqual({"who": "Point", "picture": "pic", "size": "size", "url": "url", "anchor": "anchor", "scale": "scale"});
  });
  it("should create fake Size", function() {
    expect(Gmaps4Rails.createSize(1, 3)).toEqual([1,3]);
  });
  it("should create fake Clusterer", function() {
    expect(Gmaps4Rails.createClusterer()).toEqual({ "who": "I'm Clusterer" });
  });
});