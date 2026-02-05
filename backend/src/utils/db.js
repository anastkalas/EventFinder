const sequelize = require('../config/db.config');
const logger = require('./logger');
require('../models'); // ensures all models load
async function initDB() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established.');

    sequelize.sync();
    logger.info('Database synced');
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    console.error('--- FULL ERROR DETAILS BELOW ---');
    console.error(error);
    process.exit(1);
  }
}


module.exports = initDB;