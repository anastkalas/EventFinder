const UserEventController = require('../controllers/attend.controller')
const express = require('express');
const router = express.Router();

router.post('/addAttendance', UserEventController.markAttendance);

router.get('/getAttendance/:userId/:eventId', UserEventController.getAttendance);

module.exports = router;