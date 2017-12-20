'use strict';

let map, infoWindow;
let pos = {};
let des = [];
let elevPos = {};

let searchResults = [];

function SearchResultsObject(name, add, dis, ele, rating, elecomp) {
  this.name = name;
  this.address = add;
  this.distance = dis;
  this.elevation = ele;
  this.rating = rating;
  this.elevationcomp = elecomp;
}

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

        var elevator = new google.maps.ElevationService;
        getElevationPos(elevator);

        function getElevationPos(elevator) {
          // Initiate the location request
          elevator.getElevationForLocations({
            locations: [pos],
          }, function(response, err) {
            elevPos = (Math.floor(response[0].elevation*3.28))
          })
        }

        let request = {
          location: pos,
          // rankBy: google.maps.places.RankBy.DISTANCE,
          radius: '1500',
          name: 'starbucks',//search by name
          // type: ['coffee'],// search by type
          // keyword: ['coffee']// search by keyword
        };
  //      searchResults.push(new SearchResultsObject(request.name, 0, 0, 0, 0,0));   

        // this is my current Location
        let marker = new google.maps.Marker({
          position: pos,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // image,
          animation: google.maps.Animation.DROP,
          map: map
        });
        map.setCenter(pos);

        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, processResults);
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
  var elevator = new google.maps.ElevationService;
  var distance = new google.maps.DistanceMatrixService;

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
      des.push({
        lat: results[i].geometry.location.lat(),
        lng: results[i].geometry.location.lng()
      })
      searchResults.push(new SearchResultsObject(results[i].name, results[i].vicinity, 0, 0, results[i].rating,0));      
      distanceLocation(distance, des[i], i);
      displayLocationElevation(elevator, des[i], i);
    }
    console.log(searchResults);
  }
}

// calculate distance
function distanceLocation(distance, latlng, index) {
    distance.getDistanceMatrix({
      origins: [pos],
      destinations: [latlng],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function(results, err){
      searchResults[index].distance =  results.rows[0].elements[0].distance.text;
    })
}

// calculate elevation
function displayLocationElevation(elevator, latlng, index) {
    elevator.getElevationForLocations({
      locations: [latlng], 
    }, function(response, err){
      searchResults[index].elevation =  Math.floor(response[0].elevation*3.28);
      searchResults[index].elevationcomp =  Math.abs(searchResults[index].elevation - elevPos);
    });
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

// this functions tell you if you are allowed the GPS to be accessed.
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}