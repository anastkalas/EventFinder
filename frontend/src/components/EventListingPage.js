import React from "react";
import axios from "axios";
import "../style/EventListingPage.css";
import EventCard from "./EventCard";

function HomePage(){

    return (
        <div className="page">
            <EventCard/>
            <EventCard/>
        </div>
    );
}

export default HomePage;