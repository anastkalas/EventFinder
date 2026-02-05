// client/src/components/NavBar.js
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/NavBar.css";

import profile_pic from "../assets/boy.png";
import searchicon from "../assets/search.png";
import musicIcon from "../assets/music.png";
import health from "../assets/hospital.png";
import technology from "../assets/desktop.png";
import business from "../assets/cooperation.png";
import fitness from "../assets/barbell.png";
import art from "../assets/art.png";
import { Dropdown } from "bootstrap";
import { DropdownItem } from "react-bootstrap";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState(""); // separate location field (Option B)

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "16px";
  })

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize;
    localStorage.setItem("fontItem", fontSize);
  }, [fontSize]);

  const [isDark, setIsDark] = useState(() => {
    // Load stored theme from localStorage or default to false (light)
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Apply the theme to the <body>
    if (isDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleChange = (event) => {
    setIsDark(event.target.checked);
  }
  
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("query", searchTerm.trim());
    if (searchDate) params.append("date", searchDate);
    if (searchLocation.trim()) params.append("location", searchLocation.trim()); // city only (Option 1)
    navigate(`/search?${params.toString()}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="navbar">
      <div className="upper">
        <div className="navbar-left">
          <h2 className="nav-logo">Event Finder</h2>
          <a href="/" className="home">Home</a>
        </div>

        <div className="navbar-center">
          <button className="search-btn" onClick={handleSearch}>
            <img src={searchicon} className="search-icon" alt="search" />
          </button>

          {/* Keyword */}
          <input
            type="text"
            placeholder="Keyword (e.g., music, football, technology)"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <input
            type="date"
            className="date-field"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="City (optional, e.g., Athens)"
            className="location-field"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="navbar-right">
          <form className="theme">
            <input type="checkbox" name="dark theme" value="dark" checked={isDark} onChange={handleChange}/>
            <label>Dark Theme</label>
          </form>
          <form className="font-size">
            <label htmlFor="size">Font Size</label>
            <select id="size" name="size" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option value="10px">10</option>
              <option value="16px">16</option>
              <option value="25px">25</option>
            </select>
          </form>
          <a href="/signup" className="signup">Sign Up</a>
          <a href="/login" className="login">Login</a>
          <a href="/profile" className="profile-link">
            <img src={profile_pic} className="profile-icon" alt="Profile" />
          </a>
        </div>
      </div>
      <div className="categories">
        <a href="/MusicEvents" className="music"><img src={musicIcon} className="music-icon" alt="Music" /></a>
        <a href="/HealthEvents" className="health"><img src={health} className="health-icon" alt="Health" /></a>
        <a href="/TechnologyEvents" className="technology"><img src={technology} className="technology-icon" alt="Technology" /></a>
        <a href="/BusinessEvents" className="business"><img src={business} className="business-icon" alt="Business" /></a>
        <a href="/FitnessEvents" className="fitness"><img src={fitness} className="fitness-icon" alt="Fitness" /></a>
        <a href="/ArtEvents" className="art"><img src={art} className="art-icon" alt="Art" /></a>
      </div>
    </nav>
  );
}

export default NavBar;
