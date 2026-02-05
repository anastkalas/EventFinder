// routes/recommendations.routes.js
const express = require("express");
const router = express.Router();
const recommendationsController = require("../controllers/recommendations.controller");

// Make recommendations public (no auth), per requirement: random feed
router.get("/", recommendationsController.getRecommendations);

module.exports = router;
