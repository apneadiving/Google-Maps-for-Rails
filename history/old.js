google.load('maps', '3', { other_params: 'sensor=false' });

google.setOnLoadCallback(initialize);
var gmaps4rails_map = null;
var gmaps4rails_data = null;
var markerClusterer = null;
var gmaps4rails_infowindow = null;
var gmaps_circle = null ;

//put markers on the map + launch the clusterer
function setMarkers(locations) {
	
	//variable used for Marker Clusterer
	var markers = [];
	
	if (markerClusterer) {
		markerClusterer.clearMarkers();
	}
  // Add markers to the map
  for (var i = 0; i < locations.markers.length; ++i) {
 		 // Marker sizes are expressed as a Size of X,Y
		  var image = new google.maps.MarkerImage(gmaps4rails_marker_picture,
		      																		new google.maps.Size(gmaps4rails_marker_width, gmaps4rails_marker_length)
																							);
		  var myLatLng = new google.maps.LatLng(locations.markers[i].latitude, locations.markers[i].longitude); 
		  var ThisMarker = new google.maps.Marker({position: myLatLng, map: gmaps4rails_map, icon: image}); //TODO Offer title customization title: "title"
			//save object for later use, basically, to get back the text to display when clicking it
			locations.markers[i].marker_object = ThisMarker; 
			//save the marker again in a list for the clusterer
			markers.push(ThisMarker);
			
			//add click listener
  	  google.maps.event.addListener(locations.markers[i].marker_object, 'click', function() { if (gmaps4rails_infowindow!=null) {gmaps4rails_infowindow.close();}; getInfoWindow(this);});
	
  }

	markerClusterer = new MarkerClusterer(gmaps4rails_map, markers, {
		maxZoom: 10,
		gridSize: 50,
		//styles: styles TODO: offer clusterer customization
	});	
}

//get infowindow content when listener calls it
function getInfoWindow(which)
{	
  for ( var m = 0; m < gmaps4rails_data.markers.length; ++m )
  {
    var markerInfo = gmaps4rails_data.markers[m].marker_object;
    if ( markerInfo == which ) 
    {
        gmaps4rails_infowindow = new google.maps.InfoWindow({content: gmaps4rails_data.markers[m].description });
        gmaps4rails_infowindow.open( gmaps4rails_map, which );
        return;
    }
  }
}

//initializes the map
function create_map(filter_value) {
	request = gmaps4rails_base_url + '?model=' + gmaps4rails_model;

  // if(gmaps4rails_scope != null)
  // 	  request += '&scope=' + gmaps4rails_scope;
	
	if (!(filter_value == null))
		{
		split_filter_value = filter_value.split('+');
		if (!(split_filter_value[0] == null))
			{
				request += '&filter=' + split_filter_value[0];
			}
		if (!(split_filter_value[1] == null))
			{
			request += '&options=' + split_filter_value[1];
			}
		}
	jQuery.getJSON(request,
		        function(data){
								gmaps4rails_data = data;
							  setMarkers(gmaps4rails_data);			
	});
}

function initialize() {
	gmaps4rails_reset();
	//infowindow closes when user clicks on the map
	google.maps.event.addListener(gmaps4rails_map, 'click', function() 
		{ if (gmaps4rails_infowindow != null) {gmaps4rails_infowindow.close();} 
	});
	create_map();
}

function gmaps4rails_resfreshmap() {
	 gmaps4rails_reset();
   var index = document.gmaps4rails_form.gmaps4rails_list.selectedIndex;
   var filter_value = document.gmaps4rails_form.gmaps4rails_list.options[index].value;
	 create_map(filter_value);
}

function gmaps4rails_reset(){
		gmaps4rails_map = new google.maps.Map(document.getElementById('gmaps4rails_map'), {
				zoom: gmaps4rails_map_zoom,
				center: new google.maps.LatLng(gmaps4rails_map_center_lat, gmaps4rails_map_center_long),
				mapTypeId: google.maps.MapTypeId.ROADMAP
		});
}

// max_distance in km
function filter_distance() {
	var max_distance = parseInt(document.getElementById('gmaps4rails_user_distance').value, 10);
	if (!(max_distance>0 || max_distance<0))
	{ 
	 alert('Please set the max distance');
	}
	else{
		if (gmaps_circle!=null) { gmaps_circle.setMap(null);}
		var myCenter = new google.maps.LatLng(gmaps4rails_ref_lat, gmaps4rails_ref_long);
		var filtered_markers = {"markers":[]};

	
		for (var i = 0; i < gmaps4rails_data.markers.length; ++i) {
			if (get_distance(gmaps4rails_ref_long, gmaps4rails_data.markers[i].longitude, gmaps4rails_ref_lat, gmaps4rails_data.markers[i].latitude) < max_distance)
				{ filtered_markers.markers.push(gmaps4rails_data.markers[i]);}
			setMarkers(filtered_markers);
		}
		//radius is in meters
		gmaps_circle = new google.maps.Circle({radius: max_distance*1000, center: myCenter, fillColor:"#00FF00", strokeColor: "#00EE00"}); 
		gmaps_circle.setMap(gmaps4rails_map);
	}
}

function get_distance(long1, long2, lat1, lat2) 
{
	var theta = long1 - long2; 
	var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta)); 
  dist = Math.acos(dist); 
  dist = rad2deg(dist); 
  var km = dist * 60 * 1.853;
	return km;
}

function deg2rad(value) { return value*Math.PI/180;}
function rad2deg(value) { return value*180/Math.PI;}
