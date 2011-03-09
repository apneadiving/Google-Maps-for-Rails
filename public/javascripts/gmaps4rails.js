google.load('maps', '3', { other_params: 'sensor=false' });

var Gmaps4Rails = {
	processing: 'rails_model',
	map: null,
  map_id: 'gmaps4rails',
  markers: null,
  marker_picture : "",
	marker_width : 22,
	marker_length : 32,
	map_center_latitude : 0,
	map_center_longitude : 0, 
	map_zoom : 1,
	auto_adjust : false,
	base_url : '/gmaps',
	rails_model : null,
	model_scope : null,
 	ref_latitude : null,
  ref_longitude : null,
  info_window : null,
  locations : null,
  markerClusterer: null,
  do_clustering: true,
  clusterer_gridSize: 50,
	clusterer_maxZoom: 10,
	bounds: null,
	//Triggers the creation of the map.
	//Two options:
	// 1- processing == "rails_model"  && builder = model_name
	// 2- processing == "json"    && builder = json in format: [{"description": , "longitude": , "latitude":, "picture": "", "width": "", "length": ""}]
	initialize: function(builder) {
		this.reset_map();
		//infowindow closes when user clicks on the map
		google.maps.event.addListener(this.map, 'click', function() 
			{ if (this.info_window != null) {this.info_window.close();} 
		});
		if (this.processing == "rails_model")
		{ 
			this.rails_model = builder;
			this.create_from_model();
		}
		else if (this.processing == "json")
		{
			this.locations = builder;
			this.setup_Markers();
		}
		if (this.auto_adjust) {
			this.map.fitBounds(this.bounds);
		}
	},

  // clear markers
  clear_markers: function(){
    if (this.markers) {
      for (i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = null;
    }
  },

  // replace old markers with new markers on an existing map
  replace_markers: function(new_markers){
    this.clear_markers();
    this.locations = new_markers;
                this.setup_Markers();
  },
	
	//resets the map, removes all markers
	reset_map: function(){
			this.map = new google.maps.Map(document.getElementById(this.map_id), {
					zoom: this.map_zoom,
					center: new google.maps.LatLng(this.map_center_latitude, this.map_center_longitude),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			});
	},
	
	//creates the necessary query to get the model + scope, and sends json to setup_Markers
	create_from_model: function (filter_value) {		
	  	request = this.base_url + '?model=' + this.rails_model;

		  if(this.model_scope != null)
		  	{ request += '&scope=' + this.model_scope; }
  			jQuery.getJSON(request,function(data){
													Gmaps4Rails.locations = data;
												  Gmaps4Rails.setup_Markers();			
													}
			);
	},
	
  //Creates Marker from the locations passed + markerClusterer
  setup_Markers: function () {		
		//variable used for Marker Clusterer
		var markers = [];
		//variable used for Auto-adjust
		this.bounds = new google.maps.LatLngBounds(); 
		
		//resets Clusterer if needed
		if (this.markerClusterer) {
			this.markerClusterer.clearMarkers();
		}
	  // Add markers to the map
	  for (var i = 0; i < this.locations.length; ++i) {
			   //test if value passed or use default 
			   var marker_picture = this.locations[i].picture != "" && typeof this.locations[i].picture !== "undefined" ? this.locations[i].picture : this.marker_picture;
			   var marker_width = this.locations[i].width != "" && typeof this.locations[i].width !== "undefined" ? this.locations[i].width : this.marker_width;
			   var marker_height = this.locations[i].height != "" && typeof this.locations[i].height !== "undefined" ? this.locations[i].height : this.marker_length;
				 var myLatLng = new google.maps.LatLng(this.locations[i].latitude, this.locations[i].longitude); 
         var marker_title = this.locations[i].title != "" && typeof this.locations[i].title !== "undefined" ? this.locations[i].title : null;
			 
				 // Marker sizes are expressed as a Size of X,Y
		 		 if (marker_picture == "")
					{ var ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, title: marker.title});	}
					else 
				  {
						var image = new google.maps.MarkerImage(marker_picture, new google.maps.Size(marker_width, marker_height) );
						var ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, icon: image, title: marker_title});
					}
					//save object for later use, basically, to get back the text to display when clicking it
					this.locations[i].marker_object = ThisMarker; 
					//save the marker again in a list for the clusterer
					markers.push(ThisMarker);		
					//add click listener
		  	  google.maps.event.addListener(Gmaps4Rails.locations[i].marker_object, 'click', function() { if (Gmaps4Rails.info_window!=null) {Gmaps4Rails.info_window.close();}; Gmaps4Rails.getInfoWindow(this);});
		
					//extending bounds, ref: http://unicornless.com/code/google-maps-v3-auto-zoom-and-auto-center
					if (this.auto_adjust) {
					    var ll = new google.maps.LatLng(this.locations[i].latitude, this.locations[i].longitude);
					    this.bounds.extend(ll);
					}		
		 }
		this.setup_Clusterer(markers);
	},
	
	//get info_window content when listener calls it
	getInfoWindow: function(which)
	{	
	  for ( var m = 0; m < this.locations.length; ++m )
	  {
	    var markerInfo = this.locations[m].marker_object;
	    if ( markerInfo == which && this.locations[m].description != "") 
	    {
	        this.info_window = new google.maps.InfoWindow({content: this.locations[m].description });
	        this.info_window.open( this.map, which );
	        return;
	    }
	  }
	},
	setup_Clusterer: function(markers)
	{
		if (this.do_clustering == true)
		{
			this.markerClusterer = new MarkerClusterer(this.map, markers, {	maxZoom: this.clusterer_maxZoom,
																																			gridSize: this.clusterer_gridSize,
																																			//styles: styles TODO: offer clusterer customization
																																	  	});
	  }
	}
};
