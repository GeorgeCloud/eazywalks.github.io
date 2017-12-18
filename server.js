// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 16
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var request = {
          location: pos,
          radius: '1000',
          name: ['subway']
        };

        var marker = new google.maps.Marker({
          position: pos,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // image,
          animation: google.maps.Animation.DROP,
          map: map
        });
        map.setCenter(pos);

        servicePlaces = new google.maps.places.PlacesService(map);
        servicePlaces.nearbySearch(request,callback);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
//      createMarker(results[i])
    }
  }
  subway = results
}

function createMarker(place) {

  // serviceDistance.getDistanceMatrix(
  //   {
  //     origins: marker.position,
  //     destinations: place.geometry.location,
  //   });
  var markerResults = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.geometry.location.toString()
  });
}
