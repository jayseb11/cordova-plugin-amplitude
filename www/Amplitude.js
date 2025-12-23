const exec = require('cordova/exec');
const SERVICE_NAME = 'AmplitudePlugin';

class AmplitudePlugin {
    /**
     * Initialize Amplitude with configuration
     * @param {Object} config - Configuration object
     * @param {string} config.apiKey - Amplitude API key (required)
     * @param {string} [config.userId] - Optional user ID
     * @param {boolean} [config.trackingSessionEvents] - Enable session tracking
     * @param {number} [config.minTimeBetweenSessionsMillis] - Min time between sessions
     * @returns {Promise<string>}
     */
    initialize(config) {
        return new Promise((resolve, reject) => {
            if (!config || !config.apiKey) {
                reject('API key is required');
                return;
            }
            exec(resolve, reject, SERVICE_NAME, 'initialize', [config]);
        });
    }

    /**
     * Track a custom event
     * @param {string} eventName - Name of the event
     * @param {Object} [properties={}] - Event properties
     * @returns {Promise<string>}
     */
    track(eventName, properties = {}) {
        return new Promise((resolve, reject) => {
            if (!eventName) {
                reject('Event name is required');
                return;
            }
            exec(resolve, reject, SERVICE_NAME, 'track', [eventName, properties]);
        });
    }

    /**
     * Identify a user with user ID and properties
     * @param {string} userId - User ID
     * @param {Object} [userProperties={}] - User properties
     * @returns {Promise<string>}
     */
    identify(userId, userProperties = {}) {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'identify', [userId, userProperties]);
        });
    }

    /**
     * Set the user ID
     * @param {string} userId - User ID
     * @returns {Promise<string>}
     */
    setUserId(userId) {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'setUserId', [userId]);
        });
    }

    /**
     * Set user properties
     * @param {Object} properties - User properties
     * @returns {Promise<string>}
     */
    setUserProperties(properties) {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'setUserProperties', [properties]);
        });
    }

    /**
     * Log a revenue event
     * @param {string} productId - Product identifier
     * @param {number} quantity - Quantity
     * @param {number} price - Price per unit
     * @param {string} [revenueType] - Revenue type (e.g., 'purchase', 'subscription')
     * @param {Object} [properties={}] - Additional properties
     * @returns {Promise<string>}
     */
    logRevenue(productId, quantity, price, revenueType, properties = {}) {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'logRevenue', [productId, quantity, price, revenueType, properties]);
        });
    }

    /**
     * Reset the user (logout)
     * @returns {Promise<string>}
     */
    reset() {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'reset', []);
        });
    }

    /**
     * Set the device ID
     * @param {string} deviceId - Device ID
     * @returns {Promise<string>}
     */
    setDeviceId(deviceId) {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'setDeviceId', [deviceId]);
        });
    }

    /**
     * Get the current device ID
     * @returns {Promise<string>}
     */
    getDeviceId() {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'getDeviceId', []);
        });
    }

    /**
     * Get the current session ID
     * @returns {Promise<number>}
     */
    getSessionId() {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'getSessionId', []);
        });
    }

    /**
     * Flush events to Amplitude servers immediately
     * @returns {Promise<string>}
     */
    flush() {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE_NAME, 'flush', []);
        });
    }
}

module.exports = new AmplitudePlugin();
