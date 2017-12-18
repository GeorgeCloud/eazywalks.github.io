

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// substute the lat long in the code below to change locations
// https://maps.googleapis.com/maps/api/elevation/json?locations=47.61716516970849, -122.35683198029153&key=AIzaSyDGhNQctIrADl5WyqtF1Y884c25BATX-uk


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
          radius: '500',
          name: ['subway']
        };


        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        var marker = new google.maps.Marker({
          position: pos,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // image,
          animation: google.maps.Animation.DROP,
          map: map
        });
        map.setCenter(pos);

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

//
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
  subway = results

  var origin1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
  // var origin2 = 'Greenwich, England';
  // var destinationA = 'Stockholm, Sweden';
  var destinationB = new google.maps.LatLng(subway[0].geometry.viewport.b["f"], subway[0].geometry.viewport.f["b"]);

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: [destinationB],
      travelMode: 'WALKING',
    }, callback);

  function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
  }

}

function createMarker(place) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
