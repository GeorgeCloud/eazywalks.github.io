var map, infoWindow;

let x = 47.618953;
let y = 122.348801;
let locations = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 47.618953,
      lng: 122.348801
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
          // types: ['qfc']
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

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
  let search = results;
  // search.forEach(location => {
  //   console.log(`longitude: ${location['geometry']['location'].lng()} Latitude: ${location['geometry']['location'].lat()}`)
  // });

  search.forEach(location => {
    console.log(`Distance: ${Math.sqrt((x * y) + (Math.abs(location['geometry']['location'].lng()) * Math.abs(location['geometry']['location'].lat())))}`)
  });
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
