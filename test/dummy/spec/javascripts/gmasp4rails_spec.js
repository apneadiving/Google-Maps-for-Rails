describe("Gmaps4Rails", function() {
  it("trying to test google maps", function() {
    expect(typeof(new google.maps.Point)).toEqual("object");
  });
});