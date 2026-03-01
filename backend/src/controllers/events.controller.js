const serpapiService = require("../services/serpapi.service");
const ticketmasterService = require("../services/ticketmaster.service");
const piiService = require("../services/pii.service");
const Event = require('../models/event.model');

// Helper to fetch both APIs
async function fetchAll(location, category) {
  return Promise.all([
    serpapiService.fetchEvents(location, category),
    ticketmasterService.fetchEvents(location, category),
  ]);
}

exports.getEvents = async (req, res) => {
  try {
    const location = (req.query.location && req.query.location.trim()) || "world";
    const category = req.query.category || null;
    const query = (req.query.query || "").trim();
    const date = (req.query.date || "").trim();

    let [serpapiEvents, ticketmasterEvents] = await fetchAll(location, category);

    const withPII = (arr) =>
      arr.map((ev) => ({
        ...ev,
        pii_score: piiService.computePublicInterestIndex(ev),
      }));

    let events = [...withPII(serpapiEvents), ...withPII(ticketmasterEvents)];

    // Deduplicate (prefer Ticketmaster version)
    const map = new Map();
    for (const e of events) {
      const key = `${(e.title || "").toLowerCase()}_${e.start_time_iso || e.date || ""}`; //creates key for each one if duplicated
      if (!map.has(key) || e.source === "Ticketmaster") {
        map.set(key, e);
      }
    }
    let unique = [...map.values()];

    // Keyword filter
    if (query) {
      const q = query.toLowerCase(); // search term to lowercase
      unique = unique.filter( // check if the search term is found
        (ev) =>
          ev.title?.toLowerCase().includes(q) ||
          ev.description?.toLowerCase().includes(q) ||
          ev.venue?.toLowerCase().includes(q) ||
          ev.location?.toLowerCase().includes(q)
      );
    }

    // Date filter
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) { // \d{4} exactly four digits, - is hyphen
      unique = unique.filter((ev) => ev.start_time_iso === date);
    }

    // Pagination Config
    const page = Number(req.query.page) || 1; // pull page number from URL
    const limit = 12;
    const start = (page - 1) * limit;

    // If no results AND user asked for specific location → retry globally
    if (unique.length === 0 && location.toLowerCase() !== "world") {
      const [sa2, tm2] = await fetchAll("world", category); // ignore specific city

      // code repeats the entire cleaning process again
      let fallback = [...withPII(sa2), ...withPII(tm2)];

      const map2 = new Map();
      for (const e of fallback) {
        const key = `${(e.title || "").toLowerCase()}_${e.start_time_iso || e.date || ""}`;
        if (!map2.has(key) || e.source === "Ticketmaster") {
          map2.set(key, e);
        }
      }
      fallback = [...map2.values()];

      if (query) {
        const q = query.toLowerCase();
        fallback = fallback.filter(
          (ev) =>
            ev.title?.toLowerCase().includes(q) ||
            ev.description?.toLowerCase().includes(q) ||
            ev.venue?.toLowerCase().includes(q) ||
            ev.location?.toLowerCase().includes(q)
        );
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        fallback = fallback.filter((ev) => ev.start_time_iso === date);
      }

      const sliced = fallback.slice(start, start + limit);
      return res.json({
        count: fallback.length,
        events: sliced,
        hasMore: start + limit < fallback.length,
      });
    }

    // Normal Response with Pagination
    const sliced = unique.slice(start, start + limit);

    return res.json({
      count: unique.length,
      events: sliced,
      hasMore: start + limit < unique.length,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
};


