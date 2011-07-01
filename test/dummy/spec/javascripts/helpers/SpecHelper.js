google = new function(){
	this.maps = new function(){
		this.Point = function(a,b){
			return [a, b];
		};
		this.LatLng = function(a,b){
			return [a, b];
		};
		this.Map = function(args){
			return { "who": "I'm map"};
		};
		this.LatLngBounds = function(){
			return [];
		};
		this.MarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize){
			return {"who": "Point", "picture": markerPicture, "size": markerSize, "url": origin, "anchor": anchor, "scale": scaledSize};
		};
		this.Marker = function(args){
			return { "who": "I'm marker" };
		};
		this.Marker.prototype.map = null;
		this.Marker.prototype.setMap = function(mapId) { this.map = mapId; };
		
		this.Size = function(w, h){
			return [w,h];
		};
		this.MapTypeId = function(){
			return "MapTypeId";
		};
		this.InfoWindow = function(){
			
		};
		this.event = new function(){
			this.addListener = function(){};
		}
	};
};

geoHelpers = new function(){
	//returns distance in km
	this.getDistance = function(lat1, lon1, lat2, lon2){
		var R = 6371; // km
		var dLat = (lat2-lat1).toRad();
		var dLon = (lon2-lon1).toRad();
		var lat1 = lat1.toRad();
		var lat2 = lat2.toRad();
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		return(R * c);
	};
	//just return distance from point 0, 0
	this.getDistanceFromO = function(lat1, lon1){
		return(geoHelpers.getDistance(lat1, lon1, 0, 0));
	};
};

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
};
