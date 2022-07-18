var cityToSearchInput = $("#cityToSearchInput").get(0);
var cityToSearchButton = $("#cityToSearchButton").get(0);
var searchResults = $("#searchResults").get(0);
var currentWeatherText = $("#currentWeatherText").get(0);
var apiKey = "c3a5b2cfca12a28fe7b27126d16a7432";
var citiesSearchedHistory = JSON.parse(localStorage.getItem("search")) || [];
// var items = JSON.parse(localStorage.getItem('search'));

$("#cityToSearchButton").on("click", function (e) {
  e.preventDefault();

  var cityToSearchVal = cityToSearchInput.value;
  if (cityToSearchVal.length < 3) {
    alert("Enter valid city");
  } else {
    executeWeatherGetCall(cityToSearchVal);
    citiesSearchedHistory.unshift(cityToSearchVal);
    localStorage.setItem("search", JSON.stringify(citiesSearchedHistory));


    // for (let i = 0; i < 4; i++) {
    //   console.log(localStorage.getItem(`search[${i}]`))
    // }
    getHistory(citiesSearchedHistory);
  }
});
console.log(citiesSearchedHistory);

//function to get history
function getHistory(data) {
  console.log('getHistory called');
  // grabbing from ES6 because jQuery sucks [Thanks Eric! :)]
  let historyEl = document.getElementById('history');
  historyEl.innerHTML = '';
  console.log(historyEl);
  for (let i = 0; i < 5; i++) {
    $("#history").append(`
    <section class="card">
      <h4 class="cityBtn">${data[i]}</h4>
    </section>`);
    console.log(`attempted to append cityBtn ${[i]}`);
  }
  const historyBtnEl = $('')
}


// draw the array from localstorage here
function executeWeatherGetCall(cityToSearchVal) {
  var uri = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearchVal + "&appid=" + apiKey + "&units=imperial";
  fetch(uri)
    .then((response) => response.json())
    .then((data) => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let uri2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial&exclude=hourly,minutely";
      $.get(uri2, function (response) {
        for (i = 0; i < 6; i++) {
          $("#" + i).empty();
          console.log(response);
          if ($("#searchResults").is(":visible")) {
          } else {
            $("#searchResults").toggle();
          }
          var returnedDate = new Date(response.daily[i].dt * 1000);
          var currentDate = returnedDate.toLocaleDateString();
          var img = response.daily[i].weather[0].icon;
          console.log(img);
          if (i === 0) {
            $("#0").append("<h5>" + cityToSearchVal + "</h5>");
          }
          $("#" + i).append("<h5>" + currentDate + "</h5>");
          $("#" + i).append(
            '<img src="http://openweathermap.org/img/wn/' +
            img +
            '@2x.png" alt="">'
          );
          $("#" + i).append(
            "<br> Temperature: " + response.daily[i].temp.day + " &#176F"
          );
          $("#" + i).append(
            "<br> Humidity: " + response.daily[i].humidity + "%"
          );
          $("#" + i).append(
            "<br> Wind Speed: " + response.daily[i].wind_speed + " MPH"
          );
        }
        var UV = response.daily[0].uvi;
        $("#0").append("<br> <p class='UVIndex'> UV Index: " + UV + "</p>");
        if (UV < 4) {
          $(".UVIndex").attr("class", "badge bg-success");
        } else if (UV < 8) {
          $(".UVIndex").attr("class", "badge bg-warning");
        } else {
          $(".UVIndex").attr("class", "badge bg-danger");
        }
      });
    });
}
