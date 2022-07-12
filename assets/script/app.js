function initPage() {
  // always declare variables at the top of your code

  // JQuery - this is used for its selector capabilties
  $("#myID").get(0);
  const cityEl = $("#enter-city").get(0);
  const searchEl = $("#search-button").get(0);
  const clearEl = $("#clear-history").get(0);
  const nameEl = $("#city-name").get(0);
  const currentPicEl = $("#current-pic").get(0);
  const currentTempEl = $("#temperature").get(0);
  const currentHumidityEl = $("#humidity").get(0);
  const currentWindEl = $("#wind-speed").get(0);
  const currentUVEl = $("#UV-index").get(0);
  const historyEl = $("#history").get(0);
  var fivedayEl = $("#fiveday-header").get(0);
  var todayweatherEl = $("#today-weather").get(0);

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // this is our API key from open weather map and then we assign it to a variable
  const APIKey = "c3a5b2cfca12a28fe7b27126d16a7432";

  function getWeather(cityName) {
    // execute a current weather get request from open weather api
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;

    axios.get(queryURL).then(function (response) {
      todayweatherEl.classList.remove("d-none");

      // parse response to display current weather
      const currentDate = new Date(response.data.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameEl.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentPicEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      currentPicEl.setAttribute("alt", response.data.weather[0].description);
      currentTempEl.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidityEl.innerHTML =
        "Humidity: " + response.data.main.humidity + "%";
      currentWindEl.innerHTML =
        "Wind Speed: " + response.data.wind.speed + " MPH";

      // get UV Index
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        let UVIndex = document.createElement("span");

        // when UV Index is good, shows green, when ok shows yellow, when bad shows red
        if (response.data[0].value < 4) {
          UVIndex.setAttribute("class", "badge badge-success");
        } else if (response.data[0].value < 8) {
          UVIndex.setAttribute("class", "badge badge-warning");
        } else {
          UVIndex.setAttribute("class", "badge badge-danger");
        }
        console.log(response.data[0].value);
        UVIndex.innerHTML = response.data[0].value;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
      });

      // qet 5 day forecast for this city
      let cityID = response.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        fivedayEl.classList.remove("d-none");

        //  parse response to display forecast for next 5 days
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);

          // this gives our weather.. icons for associated weather forcast
          const forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.data.list[forecastIndex].weather[0].description
          );
          forecastEls[i].append(forecastWeatherEl);
          const forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          const forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " +
            response.data.list[forecastIndex].main.humidity +
            "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }

  // gets history from local storage (if there is any data)
  searchEl.addEventListener("click", function () {
    const searchTerm = cityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory)); // this puts your json object back into storage/string form
    renderSearchHistory();
  });

  // this button clears our history
  clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
  });

  // converts kelvin to fahrenheit
  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      });
      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
}

initPage();

// "http://api.openweathermap.org/data/2.5/weather?q=" +
//     city +
//     "&appid=" +
//     APIKey +
//     "&units=imperial";

// "http://api.openweathermap.org/data/2.5/onecall?lat=" +
//       lat +
//       "&lon=" +
//       lon +
//       "&appid=" + APIKey + "=imperial&exclude=hourly,minutely";

// fetch(queryURL2).then(response => response.json()).then(data => {})
