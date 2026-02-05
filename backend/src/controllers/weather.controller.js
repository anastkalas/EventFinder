// controllers/weather.controller.js
const { getWeatherData } = require("../services/weather.service");

exports.getWeather = async (req, res) => {
  try {
    const { location, date } = req.query;

    if (!location || !date) {
      return res.status(400).json({ error: "Location and date are required." });
    }

    const weather = await getWeatherData(location, date);
    res.status(200).json(weather);
  } catch (error) {
    console.error("Weather Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
};
