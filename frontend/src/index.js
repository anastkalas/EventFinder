import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EventCard from "./components/EventCard";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import EventListingPage from "./components/EventListingPage";
import Profile from "./components/Profile";
import EventPage from "./components/EventPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MusicEvents from './components/MusicEvents';
import HealthEvents from './components/HealthEvents';
import TechnologyEvents from './components/TechnologyEvents';
import BusinessEvents from './components/BusinessEvents';
import FitnessEvents from './components/FitnessEvents';
import ArtEvents from './components/ArtEvents';
import SearchResults from './components/SearchResults';

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppRouter() {
  let user = null;
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid JSON in localStorage for user:", err);
      user = null;
    }
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/EventListingPage" element={<EventListingPage />} />
        <Route path="/event/:eventId" element={<EventPage user={user} />} />
        <Route path="/MusicEvents" element={<MusicEvents />} />
        <Route path="/HealthEvents" element={<HealthEvents />} />
        <Route path="/TechnologyEvents" element={<TechnologyEvents />} />
        <Route path="/BusinessEvents" element={<BusinessEvents />} />
        <Route path="/FitnessEvents" element={<FitnessEvents />} />
        <Route path="/ArtEvents" element={<ArtEvents />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();
