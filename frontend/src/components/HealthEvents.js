import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/HealthEvents.css";
import EventCard from "./EventCard";

function HealthEvents() {
    const [events, setEvents] = useState([]); 
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCategoryEvents();
        fetchGeneralRecommendations();
    }, []);

    const fetchCategoryEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/events?location=New+York&category=health`
            );
            setEvents(response.data.events || []);
        } catch (err) {
            console.error("Error fetching Health events:", err);
            setError("Failed to fetch health category events.");
        }
    };

    const fetchGeneralRecommendations = async (pageNumber = 1) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("User not logged in, skipping recommendations.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/recommendations?category=health&page=${pageNumber}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (pageNumber === 1) {
                setRecommendations(response.data || []);
            } else {
                setRecommendations(prev => [...prev, ...response.data]);
            }
        } catch (err) {
            console.error("Error fetching recommendations:", err);
            setError("Failed to fetch recommendations.");
        }
        setLoading(false);
    };

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchGeneralRecommendations(nextPage);
    };

    return (
        <div className="home-page">
            <h2 className="title">Event Recommendations</h2>

            {error && <p>{error}</p>}
            {recommendations.length === 0 && !loading && (
                <p>No recommendations available yet. Try adding favorites!</p>
            )}

            <div className="event-list">
                {recommendations.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            <div className="load-more-container">
                <button id="load-more" onClick={handleLoadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                </button>
            </div>
        </div>
    );
}

export default HealthEvents;
