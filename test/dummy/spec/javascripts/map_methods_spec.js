describe("Images Handling", function() {

  beforeEach(function(){
	  Gmaps4Rails.markerImages = [{"url": "test0"}, {"url": "test1"}, {"url": "test2"}, {"url": "test3"}];
  });

  afterEach(function(){
  	Gmaps4Rails.markerImages = null;
	});

  describe("includeMarkerImage", function() {
    it("should retrieve the index when url is in array", function() {
	    expect(Gmaps4Rails.includeMarkerImage(Gmaps4Rails.markerImages, "test2")).toEqual(2);
		});

		it("should return false when the url isn't in array", function() {
	    expect(Gmaps4Rails.includeMarkerImage(Gmaps4Rails.markerImages, "test4")).toBeFalsy();
		});
  });

	describe("createOrRetrieveImage", function() {
		it("should return existing image when image already exists", function() {
		  //currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition
			var image = Gmaps4Rails.createOrRetrieveImage("test1", 20, 20, null);
			expect(image).toEqual({"url": "test1"});
		});
		
		it("should return new image when image doesn't exist yet", function() {
		  var image = Gmaps4Rails.createOrRetrieveImage("test4", 20, 20, null);
			expect(image.who).toEqual("Point");
		});
	});
});

describe("createImageAnchorPosition", function() {
  it("should render null when no coordinates passed", function() {
    expect(Gmaps4Rails.createImageAnchorPosition(null)).toEqual(null);
  });

	it("should render a Point with same coordinates as passed", function() {
	  expect(Gmaps4Rails.createImageAnchorPosition([10, 20])[0]).toEqual(10);
	  expect(Gmaps4Rails.createImageAnchorPosition([10, 20])[1]).toEqual(20);
	});
});

describe("createServiceMarkersFromMarkers", function() {
  beforeEach(function() {
    Gmaps4Rails.markers = [{ "longitude": "5.9311119", "latitude": "43.1251606"} 
		 											,{ "longitude": "2.3509871", "latitude": "48.8566667"} ];
	  spyOn(Gmaps4Rails, "createInfoWindow");
	  spyOn(Gmaps4Rails, "createSidebar");
  });

  afterEach(function() {
    Gmaps4Rails.markers = null;
  	Gmaps4Rails.markers_conf.offset = 0;
		Gmaps4Rails.markers_conf.randomize = false;
  });

	describe("launch method directly", function() {
		beforeEach(function() {
		  Gmaps4Rails.createServiceMarkersFromMarkers();
	  });
	
	  it("should create objects for each marker", function() {
			for (var i = 0; i < Gmaps4Rails.markers.length; ++i) {
		  	expect(Gmaps4Rails.markers[i].serviceObject).toBeDefined();
			}
		});
	
		it("should set offset properly", function() {
		  expect(Gmaps4Rails.markers_conf.offset).toEqual(2);
		});
	
		it("should trigger InfoWindow", function() {
		  expect(Gmaps4Rails.createInfoWindow).toHaveBeenCalled();
		});
	
		it("should trigger createSidebar", function() {
		  expect(Gmaps4Rails.createSidebar).toHaveBeenCalled();
		});
	});
	
	describe("required delay to launch method", function() {
		it("should not randomize it not requested", function() {
			Gmaps4Rails.markers_conf.randomize = false;
			spyOn(Gmaps4Rails, "randomize");
		  Gmaps4Rails.createServiceMarkersFromMarkers();
			expect(Gmaps4Rails.randomize).not.toHaveBeenCalled();	  
		});

		it("should randomize if enabled", function() {
			Gmaps4Rails.markers_conf.randomize = true;
			spyOn(Gmaps4Rails, "randomize").andReturn([0,1]);
			Gmaps4Rails.createServiceMarkersFromMarkers();
			expect(Gmaps4Rails.randomize).toHaveBeenCalled();	  
		});	  
	});


});