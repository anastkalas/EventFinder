// services/weather.service.js
const axios = require("axios");

exports.getWeatherData = async (location = null, date = null) => {
  if (!location || !date) throw new Error("Missing location or date.");

  const apiKey = process.env.WEATHERMAPAPI_SECRET;
  if (!apiKey) throw new Error("Missing OpenWeather API key.");

  // Step 1: Get coordinates of the location
  const geoResponse = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
  );

  if (!geoResponse.data.length) {
    throw new Error("Unable to find location coordinates.");
  }

  const { lat, lon } = geoResponse.data[0];

  const eventDate = new Date(date);
  const now = new Date();
  const isFuture = eventDate > now;

  // Step 2: Select correct OpenWeather API endpoint
  let weatherURL;
  if (isFuture) {
    // 5-day forecast (future)
    weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    // Current weather (now or past)
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  }

  // Step 3: Fetch weather data
  const weatherResponse = await axios.get(weatherURL);

  let weatherData;
  if (isFuture && weatherResponse.data.list) {
    const forecasts = weatherResponse.data.list;
    //find the single closest to the event forecast time 
    weatherData = forecasts.reduce((closest, curr) => {
      return Math.abs(new Date(curr.dt_txt) - eventDate) <
        Math.abs(new Date(closest.dt_txt) - eventDate)
        ? curr
        : closest;
    });
  } else {
    weatherData = weatherResponse.data;
  }

  // Step 4: Structure response
  return {
    location: geoResponse.data[0].name,
    temperature: weatherData.main?.temp ?? weatherData.main?.temp_min,
    condition: weatherData.weather?.[0]?.description, // FIXED typo: was 'dercription'
    humidity: weatherData.main?.humidity, // FIXED: was 'weather.main'
    wind_speed: weatherData.wind?.speed,
    datetime:
      weatherData.dt_txt ||
      (weatherData.dt ? new Date(weatherData.dt * 1000).toISOString() : "Unknown"),
    units: {
      temperature: "°C",
      wind_speed: "m/s",
      humidity: "%",
    },
  };
};
