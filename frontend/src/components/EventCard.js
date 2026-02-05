// client/src/pages/EventCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/EventCard.css";

function EventCard({ event }) {
  const navigate = useNavigate();

  const img =
    event.image ||
    event.url ||
    "https://th.bing.com/th/id/OIP.TMjzM_W0Yn61ahSvOtBD-QHaEP?pid=ImgDetMain";
  const isoDate = event.start_time_iso || event.date || "Date not available";
  const interest = event.pii_score || "Unknown";
  const where = event.location || "Unknown";

  const openDetails = () => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  return (
    <div className="event-card" onClick={openDetails}>
      <img className="event-card-img" src={img} alt={event.title || "Event"} />

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title || "Untitled Event"}</h3>

        <p className="event-card-meta">
          <strong>Date:</strong> {isoDate}
        </p>
        <p className="event-card-meta">
          <strong>Location:</strong> {where}
        </p>
        <p className="event-card-meta">
          <strong>Interest:</strong> {interest}
        </p>

        {event.link && (
          <a
            className="event-card-link"
            href={event.link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Official Page
          </a>
        )}
      </div>
    </div>
  );
}

export default EventCard;
