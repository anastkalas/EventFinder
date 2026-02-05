const app = require('./app');
const initDB = require('./utils/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database initialization failed:", err.message);
  });
