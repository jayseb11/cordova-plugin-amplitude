// Check if running in browser (not Cordova)
const isBrowser = typeof window !== 'undefined' && !window.cordova;

// Only require cordova/exec if in Cordova environment
const exec = !isBrowser ? require('cordova/exec') : null;
const SERVICE_NAME = 'AmplitudePlugin';

// Lazy load browser SDK only when needed
let browserAmplitude = null;
let BrowserIdentify = null;
let BrowserRevenue = null;

async function getBrowserSDK() {
    if (!browserAmplitude && isBrowser) {
        try {
            // Dynamic import for browser SDK
            if (typeof window !== 'undefined' && window.amplitudeBrowser) {
                browserAmplitude = window.amplitudeBrowser;
            } else {
                const sdk = await import('@amplitude/analytics-browser');
                browserAmplitude = sdk;
            }
            BrowserIdentify = browserAmplitude.Identify;
            BrowserRevenue = browserAmplitude.Revenue;
        } catch (error) {
            console.error('Amplitude browser SDK not available:', error);
        }
    }
    return browserAmplitude;
}

class AmplitudePlugin {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize Amplitude with configuration
     * @param {Object} config - Configuration object
     * @param {string} config.apiKey - Amplitude API key (required)
     * @param {string} [config.userId] - Optional user ID
     * @param {boolean} [config.trackingSessionEvents] - Enable session tracking
     * @param {number} [config.minTimeBetweenSessionsMillis] - Min time between sessions
     * @returns {Promise<string>}
     */
    async initialize(config) {
        if (!config || !config.apiKey) {
            return Promise.reject('API key is required');
        }

        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }

            const options = {};
            if (config.minTimeBetweenSessionsMillis) {
                options.sessionTimeout = config.minTimeBetweenSessionsMillis;
            }

            await sdk.init(config.apiKey, config.userId, options).promise;
            this.initialized = true;
            return 'Amplitude initialized successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'initialize', [config]);
            });
        }
    }

    /**
     * Track a custom event
     * @param {string} eventName - Name of the event
     * @param {Object} [properties={}] - Event properties
     * @returns {Promise<string>}
     */
    async track(eventName, properties = {}) {
        if (!eventName) {
            return Promise.reject('Event name is required');
        }

        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            await sdk.track(eventName, properties).promise;
            return 'Event tracked successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'track', [eventName, properties]);
            });
        }
    }

    /**
     * Identify a user with user ID and properties
     * @param {string} userId - User ID
     * @param {Object} [userProperties={}] - User properties
     * @returns {Promise<string>}
     */
    async identify(userId, userProperties = {}) {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }

            if (userId) {
                sdk.setUserId(userId);
            }

            if (Object.keys(userProperties).length > 0) {
                const identify = new BrowserIdentify();
                for (const [key, value] of Object.entries(userProperties)) {
                    identify.set(key, value);
                }
                await sdk.identify(identify).promise;
            }

            return 'User identified successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'identify', [userId, userProperties]);
            });
        }
    }

    /**
     * Set the user ID
     * @param {string} userId - User ID
     * @returns {Promise<string>}
     */
    async setUserId(userId) {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            sdk.setUserId(userId);
            return 'User ID set successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'setUserId', [userId]);
            });
        }
    }

    /**
     * Set user properties
     * @param {Object} properties - User properties
     * @returns {Promise<string>}
     */
    async setUserProperties(properties) {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }

            const identify = new BrowserIdentify();
            for (const [key, value] of Object.entries(properties)) {
                identify.set(key, value);
            }
            await sdk.identify(identify).promise;
            return 'User properties set successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'setUserProperties', [properties]);
            });
        }
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
    async logRevenue(productId, quantity, price, revenueType, properties = {}) {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }

            const revenue = new BrowserRevenue()
                .setProductId(productId)
                .setQuantity(quantity)
                .setPrice(price);

            if (revenueType) {
                revenue.setRevenueType(revenueType);
            }

            if (Object.keys(properties).length > 0) {
                revenue.setEventProperties(properties);
            }

            await sdk.revenue(revenue).promise;
            return 'Revenue logged successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'logRevenue', [productId, quantity, price, revenueType, properties]);
            });
        }
    }

    /**
     * Reset the user (logout)
     * @returns {Promise<string>}
     */
    async reset() {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            sdk.reset();
            return 'User reset successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'reset', []);
            });
        }
    }

    /**
     * Set the device ID
     * @param {string} deviceId - Device ID
     * @returns {Promise<string>}
     */
    async setDeviceId(deviceId) {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            sdk.setDeviceId(deviceId);
            return 'Device ID set successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'setDeviceId', [deviceId]);
            });
        }
    }

    /**
     * Get the current device ID
     * @returns {Promise<string>}
     */
    async getDeviceId() {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            return sdk.getDeviceId();
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'getDeviceId', []);
            });
        }
    }

    /**
     * Get the current session ID
     * @returns {Promise<number>}
     */
    async getSessionId() {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            return sdk.getSessionId();
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'getSessionId', []);
            });
        }
    }

    /**
     * Flush events to Amplitude servers immediately
     * @returns {Promise<string>}
     */
    async flush() {
        if (isBrowser) {
            const sdk = await getBrowserSDK();
            if (!sdk) {
                return Promise.reject('Browser SDK not available');
            }
            await sdk.flush().promise;
            return 'Events flushed successfully';
        } else {
            return new Promise((resolve, reject) => {
                exec(resolve, reject, SERVICE_NAME, 'flush', []);
            });
        }
    }
}

module.exports = new AmplitudePlugin();
