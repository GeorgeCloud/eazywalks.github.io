'use strict';



function accordPopulate() {

  let template = Handlebars.compile($('#results-template').text());
  searchResults.map(place => {console.log(searchResults[0].elevation);
    $('.search-details').append(template(place));})

  var acc = $(".accordion");

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
