import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/EventPage.css";
import { useParams, useLocation } from "react-router-dom";

function EventPage({ user }) {
  const { eventId } = useParams();
  const { state } = useLocation();
  const [selectedevent, setSelectedEvent] = useState(state?.event || null);

  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [attended, setAttended] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("token");
  const userId = user?.id;

  // Fetch event details if not passed in state
  useEffect(() => {
    const fetchEvent = async () => {
      if (selectedevent || !eventId) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);
        setSelectedEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data.");
      }
    };
    fetchEvent();
  }, [eventId, selectedevent]);

  // Fetch attendance info and total count
  useEffect(() => {
    if (!userId || !eventId) {
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      console.log("DEBUG userId:", userId, "eventId:", eventId);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/getAttendance/${userId}/${eventId}`);
        setAttended(res.data.attended);
        setAttendanceCount(res.data.totalAttendance);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [eventId, userId]);

  // Toggle attendance and update total count
  const handleAttendanceToggle = async (e) => {
    const newStatus = e.target.checked;
    setAttended(newStatus);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/attendance/addAttendance`, {
        userId,
        eventId,
        attended: newStatus,
      });
      if (res.data.totalAttendance !== undefined) {
        setAttendanceCount(res.data.totalAttendance);
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  // Fetch comments and weather once event is loaded
  useEffect(() => {
    if (!selectedevent) return;
    getCommentsByEvent();
    if (selectedevent.location && selectedevent.start_time_iso) getWeatherData();
  }, [selectedevent]);

  // Fetch comments
  const getCommentsByEvent = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comments/getCommentsByEvent/${encodeURIComponent(selectedevent.id)}`
      );
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Fetch comments error:", err);
      setError("Failed to fetch comments.");
    }
  };

  // Fetch weather info
  const getWeatherData = async () => {
    try {
      let cleanLocation = selectedevent.location;
      if (cleanLocation.includes(",")) {
        const parts = cleanLocation.split(",");
        cleanLocation = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/weather/getWeather`, {
        params: { location: cleanLocation, date: selectedevent.start_time_iso },
      });
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setWeatherError("Unable to retrieve weather data.");
    }
  };

  // Add event to favorites
  const addToFavorites = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/favorites/addfav`,
        {
          event_id: selectedevent.id,
          url: selectedevent.image,
          start_time: selectedevent.start_time_iso,
          pii_score: selectedevent.pii_score || "Unknown",
          category: selectedevent.category || "Unknown",
          where: selectedevent.location || "Unknown",
          title: selectedevent.title || "Untitled Event",
          venue: selectedevent.venue || "Unknown",
          description: selectedevent.description || "No description available",
          source: selectedevent.source,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  // Post a comment
  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments/addComment`,
        {
          event_id: selectedevent.id,
          content: commentText,
          title: selectedevent.title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      getCommentsByEvent();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading && !selectedevent) {
    return <p style={{ color: "#fff" }}>Loading event details...</p>;
  }

  if (!selectedevent) {
    return (
      <div className="eventpage">
        <p>Event data is not available. Please return to the events list.</p>
      </div>
    );
  }

  const img =
    selectedevent.image ||
    selectedevent.url ||
    "https://th.bing.com/th/id/OIP.TMjzM_W0Yn61ahSvOtBD-QHaEP?pid=ImgDetMain";
  const isoDate = selectedevent.start_time_iso || selectedevent.date || "Date not available";
  const interest = selectedevent.pii_score || "Unknown";
  const where = selectedevent.location || "Unknown";

  return (
    <div className="eventpage">
      <div className="event-img">
        <img src={img} alt={selectedevent.title || "event"} className="eventpage-img" />
      </div>

      <div className="info">
        <h1 className="title">{selectedevent.title || "Untitled Event"}</h1>
        <p><strong>Date:</strong> {isoDate}</p>
        <p><strong>Location:</strong> {where}</p>
        <p><strong>Venue:</strong> {selectedevent.venue || "Unknown"}</p>
        <p><strong>Interest:</strong> {interest}</p>
        <p><strong>Category:</strong> {selectedevent.category || "Unknown"}</p>
        <p><strong>Description:</strong> {selectedevent.description || "No description available"}</p>
      </div>

      <div id="fav-com">
        <form onSubmit={postComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button type="submit">Post Comment</button>
        </form>

        <button id="fav-btn" onClick={addToFavorites}>
          Add to Favorites
        </button>

        {/* ✅ Dynamic attendance count */}
        <p><strong>Total attendance:</strong> {attendanceCount}</p>

        <label style={{ color: "#140a0aff", fontSize: "16px" }}>
          <input
            type="checkbox"
            checked={attended}
            onChange={handleAttendanceToggle}
            style={{ marginRight: "8px" }}
          />
          I attended this event
        </label>
      </div>

      <div className="weather">
        <h2>Weather Forecast</h2>
        {weatherError && <p className="error">{weatherError}</p>}
        {!weather && !weatherError && <p>Loading weather data...</p>}
        {weather && (
          <div className="weather-info">
            <p><strong>Temperature:</strong> {weather.temperature}</p>
            <p><strong>Condition:</strong> {weather.condition}</p>
            <p><strong>Humidity:</strong> {weather.humidity}</p>
            <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
          </div>
        )}
      </div>

      <div className="comments">
        <h2>Comments</h2>
        {error && <p className="error">{error}</p>}
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment, index) => (
              <li key={comment.id || index}>{comment.content}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EventPage;
