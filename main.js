'use strict';


let map, infoWindow;
let pos = {};
let des = [];
let elevPos = {};

let searchResults = [];

function SearchResultsObject(name, add, dis, ele, rating, elecomp, imgUrl) {
  this.name = name;
  this.address = add;
  this.distance = dis;
  this.elevation = ele;
  this.rating = rating;
  this.elevationcomp = elecomp;
  this.imgUrl = imgUrl;
}


function initMap(e) {
  e.preventDefault();
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

        searchResults = [];
        var elevator = new google.maps.ElevationService;
        getElevationPos(elevator);

        function getElevationPos(elevator) {
          // Initiate the location request
          elevator.getElevationForLocations({
            locations: [pos],
          }, function(response, err) {
            if (!err){console.log(response[0].elevation*3.28)}
            elevPos = (Math.floor(response[0].elevation*3.28))
          })
        }

        let request = {
          location: pos,
          // rankBy: google.maps.places.RankBy.DISTANCE,
          radius: '500',
          // name: [$('#search-name').val()],//search by name
          // type: [$('#search-type').val()],// search by type
          keyword: [$('#search').val()]// search by keyword
        };

        // empty the handlebars and results
        searchResults = [];
        $('.search-details').empty();

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
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
      des.push({
        lat: results[i].geometry.location.lat(),
        lng: results[i].geometry.location.lng()
      })
      searchResults.push(new SearchResultsObject(results[i].name, results[i].vicinity, 0, 0, results[i].rating,0));
      if (!results[i].photos) {
        searchResults[i].imgUrl = 'http://via.placeholder.com/350x150';
      } else {
        searchResults[i].imgUrl = results[i].photos[0].getUrl({maxWidth: 1000});
      }
    }
    // console.log(results);
  }
  var distance = new google.maps.DistanceMatrixService;
  let statusD = distanceLocation(distance);
  var elevator = new google.maps.ElevationService;
  let statusE = displayLocationElevation(elevator);

  setTimeout(accordPopulate, 500);
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

//calculate distance
function distanceLocation(distance) {
  let statusD = false;
  for (let i = 0; i < searchResults.length; i++) {
    distance.getDistanceMatrix({
      origins: [pos],
      destinations: [des[i]],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function(results, err){
      searchResults[i].distance =  results.rows[0].elements[0].distance.text;
      statusD = true;
    })
  }
  return statusD;
}

// calculate elevation
function displayLocationElevation(elevator) {
  let statusE = false;
  for (let i = 0; i < searchResults.length; i++) {
    elevator.getElevationForLocations({
      locations: [des[i]],
    }, function(response, err){
      searchResults[i].elevation =  Math.floor(response[0].elevation*3.28);
      searchResults[i].elevationcomp =  Math.abs(searchResults[i].elevation - elevPos);
      statusE = true;
    });
  }
  console.log(searchResults);
}

// this functions tell you if you are allowed the GPS to be accessed.
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
