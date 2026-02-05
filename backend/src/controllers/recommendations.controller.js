const { fetchEvents: fetchTicketmasterEvents } = require("../services/ticketmaster.service");
const { fetchEvents: fetchSerpapiEvents } = require("../services/serpapi.service");
const piiService = require("../services/pii.service");

exports.getRecommendations = async (req, res) => {
  try {
    const category = req.query.category || null;

    const [tm, sa] = await Promise.all([
      fetchTicketmasterEvents("world", category),
      fetchSerpapiEvents("world", category)
    ]);

    let merged = [...(tm || []), ...(sa || [])];

    // Compute interest score for every event here
    merged = merged.map(ev => ({
      ...ev,
      pii_score: piiService.computePublicInterestIndex(ev)
    }));

    // Deduplicate
    const seen = new Set();
    merged = merged.filter(ev => {
      const key = (ev.id || `${ev.title}_${ev.start_time_iso || ev.date}`).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Random shuffle for variety
    merged.sort(() => Math.random() - 0.5);

    return res.status(200).json(merged.slice(0, 12));
  } catch (err) {
    console.error("Recommendations Error:", err);
    return res.status(500).json({ error: "Failed recommendations" });
  }
};
