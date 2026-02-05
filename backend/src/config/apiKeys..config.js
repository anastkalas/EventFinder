// src/config/apiKeys.config.js
require('dotenv').config();

module.exports = {
  ticketmaster: {
    apiKey: process.env.TICKETMASTER_API_KEY,
    baseUrl: 'https://app.ticketmaster.com/discovery/v2',
  },
  serpapi: {
    apiKey: process.env.SERPAPI_KEY,
    baseUrl: 'https://serpapi.com/search.json',
  }
};
