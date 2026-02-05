// client/src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/HomePage.css";
import EventCard from "./EventCard";

function HomePage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchRecommendations = async (append = false) => {
    try {
      setLoading(true);

      // Public endpoint now; token optional
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/recommendations?page=${page}&t=${Date.now()}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      const newData = Array.isArray(response.data) ? response.data : [];

      setRecommendations(prev => {
        const existing = new Set(prev.map(e => `${e.id}-${e.title}`.toLowerCase()));
        const uniq = newData.filter(e => !existing.has(`${e.id}-${e.title}`.toLowerCase()));
        return append ? [...prev, ...uniq] : uniq;
      });

    } catch (err) {
      setError("Failed to load recommendations.");
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    setPage(p => p + 1);
    fetchRecommendations(true);
  };

  return (
    <div className="home-page">
      <h2 className="title">Event Recommendations</h2>

      {error && <p>{error}</p>}
      {recommendations.length === 0 && !loading && (
        <p>No recommendations available yet. Try searching!</p>
      )}

      <div className="event-list">
        {recommendations.map((event) => (
          <EventCard key={event.id} event={event} user={user}/>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="load-more-container">
          <button id="load-more" onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
