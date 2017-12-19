var map, infoWindow;
let pos = {};


function initMap() {

if (navigator.geolocation) {        
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        performNearbySearch(pos);
    });       
}

function performNearbySearch(currentpos) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentpos,
        zoom: 16
      });
      infoWindow = new google.maps.InfoWindow();
    https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034

    servicePlaces = new google.maps.places.PlacesService(map);
    servicePlaces.nearbySearch(request,callback);
}
