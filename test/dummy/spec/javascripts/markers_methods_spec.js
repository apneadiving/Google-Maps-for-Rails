describe("Images Handling", function() {

  beforeEach(function(){
	  Gmaps4Rails.markerImages = [{"url": "test0"}, {"url": "test1"}, {"url": "test2"}, {"url": "test3"}];
  });

  afterEach(function(){
  	Gmaps4Rails.markerImages = [];
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
		Gmaps4Rails.markers = getRawMarkers();
  });

  afterEach(function() {
    clearMarkerTraces();
  });

	describe("launch method directly", function() {
		beforeEach(function() {
			spyOn(Gmaps4Rails, "createInfoWindow");
			spyOn(Gmaps4Rails, "createSidebar");
		  Gmaps4Rails.createServiceMarkersFromMarkers();
	  });
	
	  it("should create objects for each marker", function() {
			for (var i = 0; i < Gmaps4Rails.markers.length; ++i) {
		  	expect(Gmaps4Rails.markers[i].serviceObject).toBeDefined();
			}
		});
	
		it("should set offset properly", function() {
		  expect(Gmaps4Rails.markers_conf.offset).toEqual(Gmaps4Rails.markers.length);
		});
	
    // it("should trigger InfoWindow only with markers without serviceObject", function() {
    //   expect(Gmaps4Rails.createInfoWindow).toHaveBeenCalledWith(Gmaps4Rails.markers[0]);
    //   expect(Gmaps4Rails.createInfoWindow).toHaveBeenCalledWith(Gmaps4Rails.markers[1]);
    //   expect(Gmaps4Rails.createInfoWindow).not.toHaveBeenCalledWith(Gmaps4Rails.markers[2]);
    // });
    //  
    // it("should trigger createSidebar only with markers without serviceObject", function() {
    //   expect(Gmaps4Rails.createSidebar).toHaveBeenCalledWith(Gmaps4Rails.markers[0]);
    //   expect(Gmaps4Rails.createSidebar).toHaveBeenCalledWith(Gmaps4Rails.markers[1]);
    //   expect(Gmaps4Rails.createSidebar).not.toHaveBeenCalledWith(Gmaps4Rails.markers[2]);
    // });
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

describe("createServiceMarkersFromMarkers full stack", function() {
  
  afterEach(function() {
    clearMarkerTraces();
    Gmaps4Rails.map = null;
  });
  
  it("should process all attributes from a marker (without default values)", function() {
    var marker = getFullMarker();
    Gmaps4Rails.markers = [marker];
    Gmaps4Rails.map = "map";

    spyOn(Gmaps4Rails, "createMarker");
    
    Gmaps4Rails.createServiceMarkersFromMarkers();
    
    expect(Gmaps4Rails.createMarker).toHaveBeenCalledWith({
      "marker_picture":   marker.picture,
      "marker_width":     marker.width,
      "marker_height":    marker.height,
      "marker_title":     marker.title,
      "marker_anchor":    marker.marker_anchor,
      "shadow_anchor":    marker.shadow_anchor,
      "shadow_picture":   marker.shadow_picture,
      "shadow_width":     marker.shadow_width,
      "shadow_height":    marker.shadow_height,
      "marker_draggable": marker.draggable,
      "Lat":              marker.lat,
      "Lng":              marker.lng,
      "index":            0
    });	  
    
    
    //     spyOn(Gmaps4Rails, "createLatLng").andReturn([5,43]);
    // spyOn(Gmaps4Rails, "createImageAnchorPosition").andReturn("anchor");
    //     spyOn(Gmaps4Rails, "createOrRetrieveImage").andReturn("image");
    // spyOn(Gmaps4Rails, "createMarker").andReturn("marker");
    //     expect(Gmaps4Rails.createLatLng).toHaveBeenCalledWith(marker.latitude, marker.longitude);    
    // expect(Gmaps4Rails.createImageAnchorPosition).toHaveBeenCalledWith(marker.marker_anchor);
    //     expect(Gmaps4Rails.createImageAnchorPosition).toHaveBeenCalledWith(marker.shadow_anchor);
    // expect(Gmaps4Rails.createOrRetrieveImage).toHaveBeenCalledWith(marker.picture, marker.width, marker.height, "anchor");
    //     expect(Gmaps4Rails.createOrRetrieveImage).toHaveBeenCalledWith(marker.shadow_picture, marker.shadow_width, marker.shadow_height, "anchor");
    //     expect(Gmaps4Rails.createMarker).toHaveBeenCalledWith({position: [5,43], map: "map", icon: "image", title: marker.title, draggable: marker.draggable, shadow: "image"});
  });
  
  it("should process all attributes from a marker (with default values)", function() {
    var marker = getEmptyMarker();
    Gmaps4Rails.markers = [marker];
    Gmaps4Rails.map = "map";

    spyOn(Gmaps4Rails, "createMarker");
    
    Gmaps4Rails.createServiceMarkersFromMarkers();
    
    expect(Gmaps4Rails.createMarker).toHaveBeenCalledWith({
      "marker_picture":   Gmaps4Rails.markers_conf.picture,
      "marker_width":     Gmaps4Rails.markers_conf.width,
      "marker_height":    Gmaps4Rails.markers_conf.length,
      "marker_title":     null,
      "marker_anchor":    null,
      "shadow_anchor":    null,
      "shadow_picture":   null,
      "shadow_width":     null,
      "shadow_height":    null,
      "marker_draggable": Gmaps4Rails.markers_conf.draggable,
      "Lat":              marker.lat,
      "Lng":              marker.lng,
      "index":            0
    });	  
    
    //     spyOn(Gmaps4Rails, "createLatLng").andReturn([5,43]);
    // spyOn(Gmaps4Rails, "createImageAnchorPosition").andReturn("anchor");
    //     spyOn(Gmaps4Rails, "createOrRetrieveImage").andReturn("image");
    // spyOn(Gmaps4Rails, "createMarker").andReturn("marker");
    //     expect(Gmaps4Rails.createLatLng).toHaveBeenCalledWith(marker.latitude, marker.longitude);    
    // expect(Gmaps4Rails.createImageAnchorPosition).toHaveBeenCalledWith(marker.marker_anchor);
    //     expect(Gmaps4Rails.createImageAnchorPosition).toHaveBeenCalledWith(marker.shadow_anchor);
    // expect(Gmaps4Rails.createOrRetrieveImage).toHaveBeenCalledWith(marker.picture, marker.width, marker.height, "anchor");
    //     expect(Gmaps4Rails.createOrRetrieveImage).toHaveBeenCalledWith(marker.shadow_picture, marker.shadow_width, marker.shadow_height, "anchor");
    //     expect(Gmaps4Rails.createMarker).toHaveBeenCalledWith({position: [5,43], map: "map", icon: "image", title: marker.title, draggable: marker.draggable, shadow: "image"});
  });

});

describe("create_markers", function() {
  
	it("should call all necessary methods", function() {
  	spyOn(Gmaps4Rails, "createServiceMarkersFromMarkers");
		spyOn(Gmaps4Rails, "clusterize");
  	spyOn(Gmaps4Rails, "adjustMapToBounds");
    Gmaps4Rails.markers_conf.offset = 42;
    Gmaps4Rails.create_markers();
		expect(Gmaps4Rails.createServiceMarkersFromMarkers).toHaveBeenCalled();	  
		expect(Gmaps4Rails.clusterize).toHaveBeenCalled();	  
		expect(Gmaps4Rails.adjustMapToBounds).toHaveBeenCalled();	  
    expect(Gmaps4Rails.markers_conf.offset).toEqual(0);
	});
});

describe("generic markers methods", function() {
  
  beforeEach(function() {
	  Gmaps4Rails.markers = getRawMarkers();
  });
	
	describe("showMarkers", function() {
	  it("should call show with all markers", function() {
	    spyOn(Gmaps4Rails, "showMarker");
			Gmaps4Rails.showMarkers();
	  	expect(Gmaps4Rails.showMarker.callCount).toEqual(Gmaps4Rails.markers.length);
	  });
	});
	
	describe("hideMarkers", function() {
	  it("should call hide with all markers", function() {
	    spyOn(Gmaps4Rails, "hideMarker");
			Gmaps4Rails.hideMarkers();
	  	expect(Gmaps4Rails.hideMarker.callCount).toEqual(Gmaps4Rails.markers.length);
	  });
	});
	
	describe("clearMarkers", function() {
	  it("should call clear with all markers", function() {
	    spyOn(Gmaps4Rails, "clearMarker");
			Gmaps4Rails.clearMarkers();
	  	expect(Gmaps4Rails.clearMarker.callCount).toEqual(Gmaps4Rails.markers.length);
	  });
	});
});

describe("replaceMarkers", function() {
  it("should call all necessary methods", function() {
    Gmaps4Rails.markers = ["full_of_markers"];
    spyOn(Gmaps4Rails, "createLatLngBounds");
    spyOn(Gmaps4Rails, "resetSidebarContent");
    spyOn(Gmaps4Rails, "addMarkers");
    Gmaps4Rails.replaceMarkers(getRawMarkers());
    //test if everything is reset
		expect(Gmaps4Rails.markers).toEqual([]);
		//test if necessary methods are well called
		expect(Gmaps4Rails.createLatLngBounds).toHaveBeenCalled();	  
		expect(Gmaps4Rails.resetSidebarContent).toHaveBeenCalled();	  
		expect(Gmaps4Rails.addMarkers).toHaveBeenCalledWith(getRawMarkers());	  
  });
});

describe("addMarkers", function() {
  it("should concat markers and create them", function() {
    Gmaps4Rails.markers = [{"hello": "dolly"}];
    spyOn(Gmaps4Rails, "create_markers");
    spyOn(Gmaps4Rails, "clearMarkers");
    Gmaps4Rails.addMarkers(getRawMarkers());
    expect(Gmaps4Rails.markers.length).toEqual(1 + getRawMarkers().length);
    expect(Gmaps4Rails.create_markers).toHaveBeenCalled();
    expect(Gmaps4Rails.clearMarkers).toHaveBeenCalled();
  });
});

describe("clusterize", function() {
  beforeEach(function() {
    Gmaps4Rails.markers = getRawMarkers();
		spyOn(Gmaps4Rails, "createClusterer");
		spyOn(Gmaps4Rails, "clearClusterer");
  });

	afterEach(function() {
    Gmaps4Rails.markers_conf.do_clustering = true;
	});
	
	it("should do nothing when do_clustering is false", function() {
	  Gmaps4Rails.markers_conf.do_clustering = false;
		Gmaps4Rails.clusterize();
    expect(Gmaps4Rails.createClusterer).not.toHaveBeenCalled();
	});
	
	it("should launch createClusterer when do_clustering is true", function() {
	  Gmaps4Rails.markers_conf.do_clustering = true;
	  Gmaps4Rails.clusterize();
		expect(Gmaps4Rails.createClusterer).toHaveBeenCalledWith([ undefined, undefined, true, false]);
	});
	
	it("should not clear previous clusterer if null", function() {
		Gmaps4Rails.markerClusterer = null;
		Gmaps4Rails.clusterize();
	  expect(Gmaps4Rails.clearClusterer).not.toHaveBeenCalled();
	});
	
	it("should clear previous clusterer if exists", function() {
	  Gmaps4Rails.markerClusterer = [];
		Gmaps4Rails.clusterize();
	  expect(Gmaps4Rails.clearClusterer).toHaveBeenCalled();
	});

});
