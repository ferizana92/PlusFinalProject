// 👨‍🏫 Your task
//Improve the project you've worked on and implement all features not yet implemented. Search engine, API integration, wind speed, weather description, and weather icon are mandatory. The forecast and unit conversion are optional but everything that’s included in your code should be fully working (no fake data).

// Host your project on Netlfiy, and at the bottom of your page, link to your GitHub repository.
function formatData(timesTamp) {
  let date = new Date(timesTamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  return `${currentDay} ${hours}:${minutes}`;
}
function formatDay(timesTamp) {
  let date = new Date(timesTamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tus", "Wed", "Thr", "Fri", "Sut"];

  return days[day];
}
function displayForcast(response) {
  let forcastElement = document.querySelector("#forcast");
  let forcastHtml =
    ' <div class="row row-cols-1 row-cols-md-5 g-4 text-center">';

  let forcast = response.data.daily;

  forcast.forEach(function (forcastDay, index) {
    if (index < 5) {
      forcastHtml =
        forcastHtml +
        `
    <div class="col">
      <div class="card h-100 rounded-pill">
        <div class="card-body">
          <h5
            class="card-title fw-semibold"
            id="weather-forcast-date"
          >
            ${formatDay(forcastDay.dt)}
          </h5>
          <ul class="forcastDays">
            <li class="card-text" id="weather-forcast-tempratures">
              <span class="weather-forcast-temp-max">${Math.round(
                forcastDay.temp.max
              )}°</span
              ><span class="weather-forcast-temp-min">${Math.round(
                forcastDay.temp.min
              )}°</span>
            </li>
            <li>
              <img
                src="http://openweathermap.org/img/wn/${
                  forcastDay.weather[0].icon
                }@2x.png"
                width="42"
                alt=""
                id="icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>`;
    }
  });

  forcastHtml = forcastHtml + `</div>`;
  forcastElement.innerHTML = forcastHtml;
}
function getForcast(coordinates) {
  let apiKey = "97f8e93f00107773f88eafd933ce86b7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForcast);
}

function currentWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#localTime");
  let iconElement = document.querySelector("#icon");
  celsuisTemp = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = celsuisTemp;
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatData(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
  getForcast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "97f8e93f00107773f88eafd933ce86b7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  console.log(city);
  searchCity(city);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "97f8e93f00107773f88eafd933ce86b7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("#form-search");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("New York");