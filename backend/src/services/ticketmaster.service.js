// services/ticketmaster.service.js
const axios = require("axios");

function toISODate(v) {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

/**
 * For Option 1 (city-only), we pass only &city to Ticketmaster if provided.
 * If location === "world", we pass no city/country filter.
 */
exports.fetchEvents = async (location = "world", category = null) => {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    if (!apiKey) throw new Error("Missing TICKETMASTER_API_KEY");

    const keywords = Array.isArray(category) ? category : [category || "events"];
    const all = [];

    // Extract city from the provided location string (Option 1)
    const isWorld = String(location).toLowerCase() === "world";
    const city = isWorld ? "" : String(location).split(",")[0].trim();

    for (const term of keywords) {
      const keyword = String(term || "").trim();
      if (!keyword) continue;

      let url =
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}` +
        `&keyword=${encodeURIComponent(keyword)}` +
        `&size=100&sort=random`;

      if (city) url += `&city=${encodeURIComponent(city)}`;

      try {
        const { data } = await axios.get(url);
        const rows = Array.isArray(data?._embedded?.events) ? data._embedded.events : [];

        const events = rows
          .map((ev) => {
            const venue = ev._embedded?.venues?.[0] || {};
            const cityName = venue.city?.name || "";
            const countryName = venue.country?.name || "";
            const exactLocation = [venue.name, cityName, countryName].filter(Boolean).join(", ");
            const category = ev.classifications?.[0]?.segment?.name || ev.classifications?.[0]?.genre?.name || "";
            const startRaw = ev.dates?.start?.localDate || ev.dates?.start?.dateTime || "";

            return {
              id: ev.id || Math.random().toString(36).slice(2),
              title: ev.name?.trim() || "",
              description: ev.info || ev.pleaseNote || ev.promoter?.name || "",
              image: ev.images?.[0]?.url || "",
              venue: venue.name || "",
              location: exactLocation, // exact as provided by Ticketmaster (venue, city, country)
              category: category,
              date: startRaw,
              start_time_iso: toISODate(startRaw),
              link: ev.url || "",
              source: "Ticketmaster",
              _raw_tm: ev,
            };
          })
          .filter((e) => e.title && (e.venue || e.location) && (e.image || e.link));

        all.push(...events);
      } catch (e) {
        console.error(`Ticketmaster fetch error for '${keyword}' @ '${location}':`, e.message);
      }
    }

    return all;
  } catch (err) {
    console.error("Ticketmaster error:", err.message);
    return [];
  }
};


