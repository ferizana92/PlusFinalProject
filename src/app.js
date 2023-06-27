// 👨‍🏫 Your task
//Improve the project you've worked on and implement all features not yet implemented. Search engine, API integration, wind speed, weather description, and weather icon are mandatory. The forecast and unit conversion are optional but everything that’s included in your code should be fully working (no fake data).

// Host your project on Netlfiy, and at the bottom of your page, link to your GitHub repository.
let date = document.querySelector("#weather-date");
let days = document.querySelectorAll(".day__block");
let description = document.querySelector("#weather-description");
let icon = document.querySelector(".weather__icon--today");
let place = document.querySelector("#weather-location");
let precipitation = document.querySelector("#precipitation-probality");
let temperature = document.querySelector(".weather-temp--today");
let wind = document.querySelector("#wind-speed");
let refreshBtn = document.querySelector("#weather-refresh");
let form = document.querySelector("#weather__form");
let formLocation = form.querySelector("#weather__form-location");

let root = "https://api.openweathermap.org";
let apiKey = "6782253072f7d90462731a624097fc54";

function friendlyDay(dayNumber) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNumber];
}

function friendlyMinutes(minutesNumber) {
  if (minutesNumber < 10) {
    return "0" + minutesNumber;
  } else {
    return minutesNumber;
  }
}

function friendlyDate(date) {
  let day = friendlyDay(date.getDay());
  let hours = date.getHours();
  let minutes = friendlyMinutes(date.getMinutes());

  return day + " " + hours + ":" + minutes;
}
function displayForecast(response) {
  console.log(response.data);
  let forecasElement = document.querySelector("#forecast");
  forecasElement.innerHTML = "forecast"
   let days = ["Thu", "Fri", "Sat", "Sun"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${day}</div>
        <img
          src="http://openweathermap.org/img/wn/50d@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> 18° </span>
          <span class="weather-forecast-temperature-min"> 12° </span>
        </div>
      </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}
function getForecast(coordinates)
{console.log (coordinates)
  let apiKey = "6782253072f7d90462731a624097fc54";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
  console.log(apiUrl)
  axios.get(apiUrl).then(displayForecast);
}

function displayTemp(response) {
 let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  let celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function refreshWeather(queryParams) {
  let apiParams = "appid=" + apiKey + "&units=metric";
  axios
    .get(root + "/data/2.5/weather?" + apiParams + "&" + queryParams)
    .then(function(response) {
      date.innerHTML = friendlyDate(new Date());
      place.innerHTML = response.data.name;
      description.innerHTML = response.data.weather[0].main;
      temperature.innerHTML = Math.round(response.data.main.temp);
      wind.innerHTML = Math.round(response.data.wind.speed) + "km/h";
      precipitation.innerHTML = Math.round(response.data.main.humidity) + "%";

      icon.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" +
          response.data.weather[0].icon +
          ".png"
      );
    });

  axios
    .get(root + "/data/2.5/forecast?" + apiParams + "&" + queryParams)
    .then(function(response) {
      document
        .querySelectorAll(".day__block")
        .forEach(function(element, index) {
          let day = new Date(response.data.list[index].dt_txt);
          element.querySelector(".day__block-date").innerHTML = friendlyDate(
            day
          );
          element.querySelector(".day__block-temp").innerHTML = Math.round(
            response.data.list[index].main.temp
          );

          element
            .querySelector(".day__block-image")
            .setAttribute(
              "src",
              "http://openweathermap.org/img/w/" +
                response.data.list[index].weather[0].icon +
                ".png"
            );
        });
    });
}

form.addEventListener("submit", function(event) {
  refreshWeather("q=" + form.querySelector("#weather__form-location").value);
  event.preventDefault();
});

refreshBtn.addEventListener("click", function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    refreshWeather(
      "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude
    );
  });
});

refreshWeather("q=Lisbon");
displayForecast()