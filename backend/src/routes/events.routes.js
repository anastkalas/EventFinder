const eventController = require('../controllers/events.controller');
const express = require('express');
const router = express.Router();

//when a post is made calls 'eventController.getEvents'
router.get('/', eventController.getEvents);

module.exports = router;