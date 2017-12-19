
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
let distance = require('google-distance-matrix');
let mapsG = require('@google/maps');

const googleMapsClient = mapsG.createClient({
  key: GOOGLE_API_KEY,
  Promise: Promise // 'Promise' is the native constructor.
});

  let origins = ['41.9037329,-87.7321554'];
  let destinations = ['41.8337329,-87.7321554'];
  lat = -34.397.toString();
  lng = 150.644.toString();
  

  //get elevation of location
  googleMapsClient.elevation({
    locations:`${lat}, ${lng}`
  }, function(err, response) {
    if (!err) {
      res = response.json.results[0].elevation*3.28; //meter to feet conversion
      console.log(res);
    }   
  });  

  distance.units('imperial');
  distance.matrix(origins, destinations, function (err, distances) {
      if (!err)
          console.log(distances);
          console.log(distances.rows[0].elements[0].distance.text);
  })

//   var request = {
//     location: new google.maps.LatLng(52.48, -1.89),
//     radius: '500',
//     types: ['store']
// };

// var service = new google.maps.places.PlacesService();
// service.nearbySearch(request, callback);

// function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//         for (var i = 0; i < results.length; i++) {
//            console.log(results[i].name);
//         }
//     }
// }
  