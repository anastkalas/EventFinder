const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const favoriteRoutes = require('./routes/favorites.routes');
const commentRoutes = require('./routes/comments.routes');
const authRoutes = require('./routes/auth.routes');
const recommendationRoutes = require('./routes/recommendations.routes');
const eventsController = require("./routes/events.routes");
const preferencesRoutes = require("./routes/preferences.routes");
const weatherRoutes = require("./routes/weather.routes");
const attendRoutes = require("./routes/attend.routes");

require("dotenv").config();

const logger = require('./utils/logger');
const app = express();


//set up middlewares
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(morgan('dev'));
//Routes
const eventRoutes = require('./routes/events.routes');
app.use('/api/events', eventRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/weather', weatherRoutes)
app.use('/api/attendance', attendRoutes);
//Error handler(basic version)
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({ error: 'Something went wrong!'});
});

const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;

