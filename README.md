<!DOCTYPE html>
<html>
<body>

<div align="center">
  <h1>🌐 Local Event Finder</h1>
  <p align="center">
    <em>A robust, full-stack web application designed to help users discover, track, and interact with events based on their location and interests.</em>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained" />
    <img src="https://img.shields.io/badge/License-Educational-blue.svg" alt="License" />
    <img src="https://img.shields.io/badge/Stack-MERN-blueviolet.svg" alt="Stack" />
  </p>
</div>

<hr />

<h2>🚀 Features</h2>

<h3>📅 Event Discovery & Management</h3>
<ul>
  <li><strong>Multi-Source Aggregation:</strong> Fetches events from Ticketmaster and SerpApi with automatic deduplication.</li>
  <li><strong>Interest Index (PII):</strong> A custom "Public Interest Index" service that calculates event popularity based on sales status and availability.</li>
  <li><strong>Categories:</strong> Feeds for Music, Technology, Health, Business, Fitness, and Art.</li>
  <li><strong>Smart Search:</strong> Filter events by location, date, and keyword.</li>
</ul>

<h3>👤 User Personalization</h3>
<ul>
  <li><strong>Authentication:</strong> Secure user registration and login using <strong>JWT</strong> and <strong>bcrypt</strong> password hashing.</li>
  <li><strong>Favorites & Attendance:</strong> Save events to a personal list and track attendance counts.</li>
  <li><strong>Personalized Recommendations:</strong> Generates a tailored feed based on user interests.</li>
  <li><strong>Comments:</strong> Users can leave and manage feedback on specific event pages.</li>
</ul>

<h3>☁️ Integrations & Utilities</h3>
<ul>
  <li><strong>Weather Integration:</strong> Real-time weather data for event dates using the OpenWeatherMap API.</li>
  <li><strong>Performance Caching:</strong> Server-side caching of API responses to improve speed.</li>
  <li><strong>Theming:</strong> Client-side support for Dark Mode and adjustable font sizes.</li>
</ul>

<hr />

<h2>🛠️ Tech Stack</h2>

<table width="100%">
  <tr>
    <th width="50%">Backend</th>
    <th width="50%">Frontend</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Node.js & Express.js</li>
        <li>SQLite (Sequelize ORM)</li>
        <li>Winston Logging</li>
        <li>JWT & Bcrypt</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>React.js</li>
        <li>React Router</li>
        <li>Custom CSS (Dynamic Themes)</li>
        <li>Axios API Client</li>
      </ul>
    </td>
  </tr>
</table>

<hr />

<h2>📂 Project Structure</h2>

<pre>
├── backend/                # Node.js Express Backend
│   ├── logs/               # Application & error logs
│   ├── src/
│   │   ├── config/         # DB and API configurations
│   │   ├── controllers/    # Route logic (Auth, Events, etc.)
│   │   ├── middleware/     # Auth and Caching middlewares
│   │   ├── models/         # Sequelize schemas
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # External API integrations
│   │   ├── utils/          # Helper functions & loggers
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── .env                # Backend environment secrets
│   └── database.sqlite     # Local SQLite database file
│
├── frontend/               # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and media
│   │   ├── components/     # UI Components (NavBar, EventCard, etc.)
│   │   ├── style/          # CSS Stylesheets
│   │   ├── App.test.js     # Frontend tests
│   │   ├── index.css       # Global styles
│   │   ├── index.js        # Main entry point
│   │   └── reportWebVitals.js
│   └── .env                # Frontend environment variables
│
└── .gitignore              # Root git ignore file
</pre>

<hr />

<h2>📡 API Endpoints</h2>

<h3>🔐 Authentication & Users</h3>
<table width="100%">
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
    <th>Middleware</th>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td>/register</td>
    <td>Register a new user account</td>
    <td>None</td>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td>/login</td>
    <td>Authenticate user and get token</td>
    <td>None</td>
  </tr>
</table>

<h3>📅 Events & Attendance</h3>
<table width="100%">
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
    <th>Middleware</th>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td>/api/events</td>
    <td>Fetch list of events</td>
    <td>None</td>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td>/addAttendance</td>
    <td>Mark user as attending</td>
    <td>None</td>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td>/getAttendance/:uId/:eId</td>
    <td>Check attendance status</td>
    <td>None</td>
  </tr>
</table>

<h3>💬 Comments</h3>
<table width="100%">
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
    <th>Middleware</th>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td>/addComment</td>
    <td>Post a new comment</td>
    <td><strong>Auth</strong></td>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td>/getCommentsByEvent/:id</td>
    <td>Fetch comments for event</td>
    <td>None</td>
  </tr>
  <tr>
    <td><code>DELETE</code></td>
    <td>/deleteComment/:title</td>
    <td>Remove a comment</td>
    <td><strong>Auth</strong></td>
  </tr>
</table>

<h3>❤️ Favorites & Weather</h3>
<table width="100%">
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
    <th>Middleware</th>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td>/getFavorites</td>
    <td>Retrieve saved events</td>
    <td><strong>Auth</strong></td>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td>/addfav</td>
    <td>Save event to favorites</td>
    <td><strong>Auth</strong></td>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td>/getWeather</td>
    <td>Fetch weather for event</td>
    <td>None</td>
  </tr>
</table>

<hr />

<h2>⚙️ Setup & Installation</h2>

<h4>1. Environment Variables</h4>
<p>Create a <code>.env</code> file in the <code>server</code> directory:</p>
<pre>
PORT=5000
JWT_SECRET=your_secret
TICKETMASTER_API_KEY=your_key
SERPAPI_KEY=your_key
WEATHERMAPAPI_SECRET=your_key
</pre>

<h4>2. Backend Setup</h4>
<pre>
cd backend
npm install
npm start
</pre>

<h4>3. Frontend Setup</h4>
<pre>
cd frontend
npm install
npm start
</pre>

<hr />

<div align="center">
  <p>🛡️ <em>This project is for educational purposes. All event data is provided by Ticketmaster and SerpApi. Weather data is provided by OpenWeatherMap.</em></p>
</div>

</body>
</html>
