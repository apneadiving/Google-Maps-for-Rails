var gmap;

beforeEach(function() {
  gmap = new Gmaps4RailsGoogle();
});

describe("initialization", function() {
  
  beforeEach(function() {
    this.default_config = {
      maxZoom:                gmap.map_options.maxZoom,
      minZoom:                gmap.map_options.minZoom,
      zoom:                   gmap.map_options.zoom,
      center:                 gmap.createLatLng(gmap.map_options.center_latitude, gmap.map_options.center_longitude),
      mapTypeId:              google.maps.MapTypeId[gmap.map_options.type],
      mapTypeControl:         gmap.map_options.mapTypeControl,
      disableDefaultUI:       gmap.map_options.disableDefaultUI,
      disableDoubleClickZoom: gmap.map_options.disableDoubleClickZoom,
      draggable:              gmap.map_options.draggable
    }
    
    spyOn(document, "getElementById").andReturn("map");
    spyOn(google.maps, "Map"); 
  });
  
  it("should send default config when no raw provided", function() {
    gmap.createMap();
    expect(google.maps.Map).toHaveBeenCalledWith("map", this.default_config);
  });
  
  it("should take default config passed", function() {
    gmap.map_options.raw = { disableDefaultUI: true, heading: 20 };
    gmap.createMap();
    var correct_options = {
      maxZoom:                gmap.map_options.maxZoom,
      minZoom:                gmap.map_options.minZoom,
      zoom:                   gmap.map_options.zoom,
      center:                 gmap.createLatLng(gmap.map_options.center_latitude, gmap.map_options.center_longitude),
      mapTypeId:              google.maps.MapTypeId[gmap.map_options.type],
      mapTypeControl:         gmap.map_options.mapTypeControl,
      disableDefaultUI:       true,
      disableDoubleClickZoom: gmap.map_options.disableDoubleClickZoom,
      draggable:              gmap.map_options.draggable,
      heading:                20
    };
    expect(google.maps.Map).toHaveBeenCalledWith("map", correct_options);

  });
});