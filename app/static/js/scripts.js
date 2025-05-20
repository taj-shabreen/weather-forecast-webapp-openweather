document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("city-form");
  const cityInput = document.getElementById("city-input");
  const countryInput = document.getElementById("country-input");
  const currentWeatherSection = document.getElementById("current-weather");
  const forecastSection = document.getElementById("forecast");
  const forecastContent = document.getElementById("forecast-content");
  const weatherBackground = document.getElementById("weather-background");
  const moreButton = document.getElementById("more-btn");

  const apiKey = "YOUR_API_KEY_HERE";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    const country = countryInput.value.trim();

    if (!city || !country) {
      alert("Please enter both city and country.");
      return;
    }

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${apiKey}&units=metric`
      );
      if (!currentRes.ok) throw new Error("City not found.");

      const currentData = await currentRes.json();
      displayWeather(currentData);
      updateBackground(currentData.weather[0].main);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${apiKey}&units=metric`
      );
      if (!forecastRes.ok) throw new Error("Forecast not available.");

      const forecastData = await forecastRes.json();
      displayForecast(forecastData);

      moreButton.classList.remove("hidden");
      forecastSection.classList.add("hidden");
    } catch (error) {
      currentWeatherSection.innerHTML = `<p class="error-message">${error.message}</p>`;
      forecastContent.innerHTML = "";
      weatherBackground.style.backgroundImage = "";
      moreButton.classList.add("hidden");
      forecastSection.classList.add("hidden");
    }
  });

  function displayWeather(data) {
    currentWeatherSection.innerHTML = `
      <div class="weather-card">
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    `;

    gsap.from(".weather-card", {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power2.out"
    });
  }

  function displayForecast(data) {
    const dailyMap = new Map();
    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, entry);
      }
    });

    let html = "";
    dailyMap.forEach((entry, date) => {
      html += `
        <div class="weather-card">
          <h3>${new Date(date).toDateString()}</h3>
          <p>${entry.weather[0].description}</p>
          <p>Temp: ${entry.main.temp}°C</p>
          <p>Humidity: ${entry.main.humidity}%</p>
          <p>Wind: ${entry.wind.speed} m/s</p>
        </div>
      `;
    });

    forecastContent.innerHTML = html;

    gsap.from("#forecast-content .weather-card", {
      duration: 1,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.out"
    });
  }

  function updateBackground(condition) {
    let imageUrl = "";
    switch (condition.toLowerCase()) {
      case "clear":
        imageUrl = "url('/static/images/clear.jpg')";
        break;
      case "clouds":
        imageUrl = "url('/static/images/cloudy.jpg')";
        break;
      case "rain":
        imageUrl = "url('/static/images/rain.jpg')";
        break;
      case "snow":
        imageUrl = "url('/static/images/snow.jpg')";
        break;
      case "thunderstorm":
        imageUrl = "url('/static/images/thunderstorm.jpg')";
        break;
      default:
        imageUrl = "url('/static/images/weather.jpg')";
        break;
    }

    weatherBackground.style.backgroundImage = imageUrl;
    weatherBackground.style.transition = "background-image 1s ease-in-out";
    weatherBackground.style.backgroundSize = "cover";
    weatherBackground.style.backgroundPosition = "center";
  }

  function toggleForecast() {
    forecastSection.classList.toggle("hidden");
    gsap.from("#forecast-content", {
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: "power1.out"
    });
  }

  moreButton.addEventListener("click", toggleForecast);
});
