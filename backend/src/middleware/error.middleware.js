const logger = require('../utils/logger');

function errorHandler(err, req, res, next){
    // Log the error details using the custom logger.
    logger.error(`[${req.method}] ${req.url} - ${err.message}`);

    // Determine the HTTP status code for the response.
    const status = err.status || 500;
    // Prepare the message to send back to the client.
    const message =
        status === 500
        ?'Internal Server Error - Please try again later.'
        : err.message;

    //send a structured JSON response
    res.status(status).json({
        success: false,
        error: message
    });
}

module.exports = errorHandler;