
'use strict';

let map, infoWindow;
let pos = {};
let des = [];
let posElev = {};
let desElev = [];
let elevFinal =[];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 47.6182,
      lng: -122.3519
    },
    zoom: 16
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let request = {
          location: pos,
          // rankBy: google.maps.places.RankBy.DISTANCE,
          radius: '300',
          name: ['subway'],//search by name
          // type: ['coffee'],// search by type
          // keyword: ['coffee']// search by keyword
        };




        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, processResults);
        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);

        // this is my current Location
        let marker = new google.maps.Marker({
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

function processResults(results, status) {
  console.log(results);
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
      des.push({
        lat: results[i].geometry.location.lat(),
        lng: results[i].geometry.location.lng()
      });

    }
    // console.log(results[0].geometry.location.lat());
    // console.log(results[0].geometry.location.lng());
  }
  var elevator = new google.maps.ElevationService;
  distance();
  getElevationPos(elevator);
  // getElevationDes(elevator);
  // getElevationCompare();
  console.log('this is pos lat/log:', pos);
  console.log('this is des lat/log:', des);
}


// calculate DISTANCE
function distance() {
  for (let i = 0; i < des.length; i++) {
    var dist = getDistance(
      {lat: pos.lat, lon: pos.lng},
      {lat: des[i].lat, lon: des[i].lng}
    )
    // console.log('this is distance: ' + dist + ' meters')
  }
}

// creates the markers
function createMarker(place) {
  let marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map
  });
// this code lets you click on the marker for more info
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}

// calculate evelation
function getElevationPos(elevator) {
  // Initiate the location request
  elevator.getElevationForLocations({
    locations: [pos],
  }, function(response, err) {
    if (!err){console.log(response[0].elevation*3.28)}
    posElev = (Math.floor(response[0].elevation*3.28))
    console.log('this is pos elevation:', posElev);
  })
  getElevationDes(elevator);
}

function getElevationDes(elevator) {
  // Initiate the location request
  for (let i = 0; i < des.length; i++) {
    elevator.getElevationForLocations({
      locations: [des[i]],
    }, function(response){
      desElev.push(Math.floor(response[0].elevation*3.28))
    })
  }
  console.log('this is des evelation:', desElev);
  getElevationCompare();
}

// test function for elevation
function getElevationCompare() {
  for (let i = 0; i < desElev.length; i++) {
    elevFinal.push(Math.abs(posElev - desElev[i]))
  }
  console.log('this is elev final:', elevFinal);
}


// this functions tell you if you are allowed the GPS to be accessed.
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}