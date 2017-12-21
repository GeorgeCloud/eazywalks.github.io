'use strict';
//this is pikachu animation
var pikachu = $('img').hide();

function loadingScreen(){
  $('main').hide()
  $('img').css('display', '');
  $('#map').hide();
}

function accordPopulate() {
  console.log(searchResults);
  $('main').show()
  $('img').css('display', 'none');

  let template = Handlebars.compile($('#results-template').text());
  searchResults.map(place => {console.log(searchResults[0].distance);
    $('.search-details').append(template(place));})

  var acc = document.getElementsByClassName("accordion");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}

$('#google-button').on('click', function(){
  loadingScreen();
  initMap(event);
})
