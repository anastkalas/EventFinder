// services/serpapi.service.js
const axios = require("axios");

// Very tolerant ISO day extractor; returns YYYY-MM-DD or null
function toISODate(v) {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

//try to find the category of the event that is fetched
function classifyEvent(title) {
  const t = title.toLowerCase();

  if (/(concert|music|band|dj|tour|orchestra)/.test(t)) return "Music";
  if (/(game|match|tournament|race|league|cup|fight)/.test(t)) return "Sports";
  if (/(theatre|musical|play|opera|ballet|comedy)/.test(t)) return "Theatre/Arts";
  if (/(festival|fair|carnival|parade|exhibition)/.test(t)) return "Festival";
  if (/(conference|seminar|summit|lecture|workshop)/.test(t)) return "Conference";
  return "Other";
}


/**
 * Fetch events via SerpApi Google Events.
 * - location: "world" => omit location param (global)
 * - location: "<city>" => pass through as given, e.g., "Athens"
 * Returns normalized events with fields used by the app.
 */
exports.fetchEvents = async (location = "world", category = null) => {
  try {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) throw new Error("Missing SERPAPI_KEY");

    const keywords = Array.isArray(category) ? category : [category || "events"];
    const all = [];

    for (const term of keywords) {
      const keyword = String(term || "").trim();
      if (!keyword) continue;

      const params = {
        engine: "google_events",
        q: `${keyword} events`,
        hl: "en",
        api_key: apiKey,
      };
      // Location handling
      if (location.toLowerCase() !== "world") {
        params.location = location; // pass city like "Athens"
      }

      const { data } = await axios.get("https://serpapi.com/search.json", { params });
      const rows = Array.isArray(data?.events_results) ? data.events_results : [];

      const events = rows
        .map((ev) => {
          const address =
            Array.isArray(ev.address) && ev.address.length
              ? ev.address.join(", ")
              : ev.address || ev.location?.name || ev.organizer?.name || "";

          const startRaw = ev.date?.start_date || ev.date?.when || "";
          return {
            id: ev.event_id || ev.title || Math.random().toString(36).slice(2),
            title: ev.title?.trim() || "",
            description: ev.description || ev.snippet || "",
            image: ev.thumbnail || ev.image || "",
            venue: ev.venue?.name || ev.location?.name || "",
            location: address, // exact text as provided by Google Events
            date: startRaw,
            start_time_iso: toISODate(startRaw),
            link: ev.link || "",
            source: "SerpApi",
            category: classifyEvent(ev.title || "Unable to find category."), // ← Add this line
          };
        })
        .filter((e) => e.title && (e.venue || e.location) && (e.image || e.link));

      all.push(...events);
    }

    return all;
  } catch (err) {
    console.error("SerpApi error:", err.message);
    return [];
  }
};

