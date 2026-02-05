import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import EventCard from "./EventCard";

function SearchResults() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const date = searchParams.get("date") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    setEvents([]);
    setPage(1);
    fetchResults(1, true);
  }, [query, date, location]);

  const fetchResults = async (pageNum = page, reset = false) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (location) params.append("location", location);
      else params.append("location", "world");

      if (query) params.append("query", query);
      if (date) params.append("date", date);
      params.append("page", pageNum);

      const url = `${process.env.REACT_APP_API_URL}/api/events?${params.toString()}`;
      const resp = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const list = Array.isArray(resp.data?.events) ? resp.data.events : [];

      if (reset) setEvents(list);
      else setEvents((prev) => [...prev, ...list]);

      setHasMore(resp.data.hasMore);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="search-results">
      <h2>
        Search Results
        {query ? ` for "${query}"` : ""} {date ? ` on ${date}` : ""}
        {location ? ` in ${location}` : " (Worldwide)"}
      </h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-list">
          {events.map((e, index) => (
            <EventCard
              key={`${e.id || e.title}_${e.start_time_iso || "nodate"}_${index}`}
              event={e}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          className="load-more-btn"
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchResults(nextPage);
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default SearchResults;
