google.load('maps', '3', { other_params: 'sensor=false' });

var Gmaps4Rails = {
	processing: 'rails_model',
	map: null,
  marker_picture : 'http://inmotionchiro.com/gmap_plugin/imgs/markers/marker.png',
	marker_width : 22,
	marker_length : 32,
	map_center_latitude : 0,
	map_center_longitude : 0, 
	map_zoom : 1,
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
	},
	
	//resets the map, removes all markers
	reset_map: function(){
			this.map = new google.maps.Map(document.getElementById('gmaps4rails_map'), {
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
	
		//resests Clusterer if needed
		if (this.markerClusterer) {
			this.markerClusterer.clearMarkers();
		}
	  // Add markers to the map
	  for (var i = 0; i < this.locations.length; ++i) {
		   
		   //test if value passed or use default 
		   var marker_picture = this.locations[i].picture != "" && typeof this.locations[i].picture !== "undefined" ? this.locations[i].picture : this.marker_picture;
		   var marker_width = this.locations[i].width != "" && typeof this.locations[i].width !== "undefined" ? this.locations[i].width : this.marker_width;
		   var marker_height = this.locations[i].height != "" && typeof this.locations[i].height !== "undefined" ? this.locations[i].height : this.marker_length;
	 		 // Marker sizes are expressed as a Size of X,Y
			  var image = new google.maps.MarkerImage(marker_picture,
			      																		new google.maps.Size(marker_width, marker_height)
																								);
			  var myLatLng = new google.maps.LatLng(this.locations[i].latitude, this.locations[i].longitude); 
			  var ThisMarker = new google.maps.Marker({position: myLatLng, map: this.map, icon: image}); //TODO Offer title customization title: "title"
				//save object for later use, basically, to get back the text to display when clicking it
				this.locations[i].marker_object = ThisMarker; 
				//save the marker again in a list for the clusterer
				markers.push(ThisMarker);		
				//add click listener
	  	  google.maps.event.addListener(Gmaps4Rails.locations[i].marker_object, 'click', function() { if (Gmaps4Rails.info_window!=null) {Gmaps4Rails.info_window.close();}; Gmaps4Rails.getInfoWindow(this);});		
  	}
		if (this.do_clustering == true)
			{
				this.markerClusterer = new MarkerClusterer(this.map, markers, {
				maxZoom: this.clusterer_maxZoom,
				gridSize: this.clusterer_gridSize,
				//styles: styles TODO: offer clusterer customization
		  	});
		  }
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
	}
	
};