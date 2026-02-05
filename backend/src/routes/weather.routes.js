const weatherController = require('../controllers/weather.controller');
const express = require('express');
const router = express.Router();

//get comments for a specific event
router.get('/getWeather', weatherController.getWeather);

module.exports = router;