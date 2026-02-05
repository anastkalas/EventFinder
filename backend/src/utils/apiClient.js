const axios = require('axios');
const logger = require('./logger');

//create reusble axios instance
const apiClient = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json'}
});

//Request logging
apiClient.interceptors.request.use(
    (config) => {
        logger.info(`Outgoing request: [${config.method.toUpperCase()}] ${config.url}`);
        return config;
    },
    (error) => {
        logger.error(`Request error: ${error.message}`);
        return Promise.reject(error);
    }
);

//Response logging + automatic retry on transient errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        const shouldRetry = [429, 502, 503, 504].includes(status);//rate limit or temporary errors
    
        if(shouldRetry && !error.config._retryCount){
            error.config._retryCount = 1;
            logger.warn(`Retrying request to ${url} due to temporary failure (${status})...`);
            await new Promise((res) => setTimeout(res, 2000)); //wait 2s before retry
            return apiClient(error.config);
        }

        logger.error(`API request failed: ${url} | Status: ${status} | Message: ${error.message}`);
        return Promise.reject(error);
    }
)

module.exports = apiClient;