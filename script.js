const WeatherDetails = document.querySelector('.weather-details');
const apiKey = "14ab2c0b077279901afa6e0c9e1f8cac";

getWeather("Hyderabad");

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city!");

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Get current weather
    const currentRes = await fetch(currentWeatherUrl);
    if (!currentRes.ok) throw new Error("City not found");
    const currentData = await currentRes.json();

    // Get forecast
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const weatherMain = currentData.weather[0].main;
    const weatherIcon = getWeatherIcon(weatherMain);

    let details = `
      <div class="location">${currentData.name}, ${currentData.sys.country}</div>
      <div class="temp">${Math.round(currentData.main.temp)}°C</div>
      <div class="weather">
        ${weatherIcon}
        <span>${weatherMain}</span>
      </div>
      <div class="details">
        <div class="col">
          <img src="https://img.icons8.com/android/24/ffffff/humidity.png" alt="Humidity icon"/>
          <div>
            <p>${currentData.main.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
        <div class="col">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/wind.png" alt="Wind"/>
          <div>
            <p>${currentData.wind.speed} km/h</p>
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    `;

    // Process forecast
    const dailyData = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(item);
    });

    const forecastHTML = Object.entries(dailyData)
      .slice(1, 7) // skip today, show next 6 days
      .map(([date, entries]) => {
        const temps = entries.map(e => e.main.temp);
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const main = entries[0].weather[0].main;
        return `
          <div class="forecast-day">
            <strong>${new Date(date).toDateString()}</strong>
            <p>${Math.round(avgTemp)}°C</p>
            ${getWeatherIcon(main)}
            <p>${main}</p>
          </div>
        `;
      }).join("");

    details += `<div class="forecast">${forecastHTML}</div>`;

    WeatherDetails.innerHTML = details;

  } catch (error) {
    alert(error.message);
  }
}

function getWeatherIcon(main) {
  if (main === "Clear") return `<img src="https://img.icons8.com/emoji/48/sun-emoji.png" alt="Clear">`;
  if (main === "Clouds") return `<img src="https://img.icons8.com/emoji/48/cloud-emoji.png" alt="Cloudy">`;
  if (main === "Rain") return `<img src="https://img.icons8.com/emoji/48/cloud-with-rain-emoji.png" alt="Rain">`;
  if (main === "Drizzle") return `<img src="https://img.icons8.com/emoji/48/cloud-with-rain-emoji.png" alt="Drizzle">`;
  if (main === "Thunderstorm") return `<img src="https://img.icons8.com/emoji/48/cloud-with-lightning-and-rain-emoji.png" alt="Thunderstorm">`;
  if (main === "Snow") return `<img src="https://img.icons8.com/3d-fluency/94/snow.png" alt="Snow">`;
  if (main === "Mist" || main === "Fog" || main === "Haze") return `<img src="https://img.icons8.com/plasticine/100/fog-night--v1.png" alt="${main}">`;
  if (main === "Sand") return `<img src="https://img.icons8.com/color/48/desert-landscape.png" alt="Sand">`;
  if (main === "Squall") return `<img src="https://img.icons8.com/emoji/48/cloud-with-lightning-and-rain.png" alt="Squall">`;
  if (main === "Tornado") return `<img src="https://img.icons8.com/external-wanicon-flat-wanicon/64/external-tornado-climate-change-wanicon-flat-wanicon.png" alt="Tornado">`;
  return `<img src="https://img.icons8.com/emoji/48/question-mark-emoji.png" alt="Unknown">`;
}
