const NodeCache = require('node-cache');//provides an in memory caching system
const logger = require('../utils/logger');

const cache = new NodeCache({ stdTTL: 3600 });

//caches http responses to improve performance by avoiding repeating computation or API calls
function cacherMiddleware(req, res, next){

    //create uniqie cache key
    const key = `events:${req.originalUrl}`;
    const cached = cache.get(key);//retrieve the cached response

    if(cached){
        //return the key to the client
        logger.info(`Cache hit for ${key}`);
        return res.json(cached);
    }

    //if cache does not contain value for this key override the 'res.json' method
    const originalJson = res.json.bind(res);// Save a reference to the original 'res.json' method.

    // Redefine the 'res.json' function to intercept outgoing responses.
    res.json = (data) => {
        // Save the outgoing response data in cache using the generated key.
        cache.set(key, data);
        logger.info(`Cache saved for ${key}`);
        return originalJson(data);
    };

    //continue to the next middleware
    next();
}

module.exports = cacherMiddleware;