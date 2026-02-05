// services/recommendations.service.js
// Not used if controller already returns random, but kept for compatibility
const { fetchEvents: fetchTicketmasterEvents } = require("./ticketmaster.service");
const { fetchEvents: fetchSerpapiEvents } = require("./serpapi.service");

exports.generateRecommendations = async () => {
  try {
    const location = "New York";
    const [tm, serp] = await Promise.all([
      fetchTicketmasterEvents(location),
      fetchSerpapiEvents(location),
    ]);
    const merged = [...(tm || []), ...(serp || [])];

    const seen = new Set();
    const unique = merged.filter(ev => {
      const key = (ev.id || `${ev.title}_${ev.start_time_iso || ev.date}`)?.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort(() => Math.random() - 0.5);
    return unique.slice(0, 10);
  } catch (err) {
    console.error("Error in generateRecommendations:", err);
    throw err;
  }
};
