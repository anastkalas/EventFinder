import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";

function ArtEvents() {
    const [recommendations, setRecommendations] = useState([]); // visible events
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    // Fetch recommendations
    const fetchRecommendations = async (append = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Add a random query param (to help backend differentiate fetches)
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/recommendations?category=art&page=${page}&t=${Date.now()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const newData = response.data || [];
            console.log(newData);
            // Filter out duplicates using event ID or title
            setRecommendations((prev) => {

                const existingKeys = new Set(prev.map((e) => `${e.id}-${e.title}`.toLowerCase()));
                const uniqueNew = newData.filter(
                    (e)=> !existingKeys.has(`${e.id}-${e.title}`.toLowerCase())
                );
                return append ? [...prev, ...uniqueNew] : uniqueNew;
            });
        } catch (err) {
            setError("Failed to load recommendations.");
            console.error("Error fetching recommendations:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchRecommendations(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle Load More
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchRecommendations(true);
    };

    return (
        <div className="home-page">

            {/* Title */}
            <h2 className="title">Event Recommendations</h2>

            {/* Conditional rendering */}
            {error && <p>{error}</p>}
            {recommendations.length === 0 && !loading && (
                <p>No recommendations available yet. Try adding favorites!</p>
            )}

            {/* Event list */}
            <div className="event-list">
                {recommendations.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {/* Load More button - always visible */}
            <div className="load-more-container">
                <button id="load-more" onClick={handleLoadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                </button>
            </div>
        </div>
    );
}

export default ArtEvents;
