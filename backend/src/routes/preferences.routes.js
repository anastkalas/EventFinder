const preferencesController = require('../controllers/preferences.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

router.get('/getPreferences', auth, preferencesController.getPreferencesFromFav);

module.exports = router;