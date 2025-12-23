package com.gratitude.amplitude;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

import com.amplitude.android.Amplitude;
import com.amplitude.android.Configuration;
import com.amplitude.android.events.Identify;
import com.amplitude.android.events.Revenue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class AmplitudePlugin extends CordovaPlugin {

    private static final String TAG = "AmplitudePlugin";
    private Amplitude amplitude;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "initialize":
                this.initialize(args.getJSONObject(0), callbackContext);
                return true;
            case "track":
                this.track(args.getString(0), args.optJSONObject(1), callbackContext);
                return true;
            case "identify":
                this.identify(args.optString(0), args.optJSONObject(1), callbackContext);
                return true;
            case "setUserId":
                this.setUserId(args.optString(0), callbackContext);
                return true;
            case "setUserProperties":
                this.setUserProperties(args.getJSONObject(0), callbackContext);
                return true;
            case "logRevenue":
                this.logRevenue(
                    args.getString(0),
                    args.getInt(1),
                    args.getDouble(2),
                    args.optString(3),
                    args.optJSONObject(4),
                    callbackContext
                );
                return true;
            case "reset":
                this.reset(callbackContext);
                return true;
            case "setDeviceId":
                this.setDeviceId(args.getString(0), callbackContext);
                return true;
            case "getDeviceId":
                this.getDeviceId(callbackContext);
                return true;
            case "getSessionId":
                this.getSessionId(callbackContext);
                return true;
            case "flush":
                this.flush(callbackContext);
                return true;
            default:
                return false;
        }
    }

    private void initialize(JSONObject config, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                String apiKey = config.getString("apiKey");

                if (apiKey == null || apiKey.isEmpty()) {
                    callbackContext.error("API key is required");
                    return;
                }

                Context context = cordova.getActivity().getApplicationContext();

                // Create configuration
                Configuration amplitudeConfig = new Configuration(apiKey, context);

                // Set optional configuration
                if (config.has("trackingSessionEvents")) {
                    amplitudeConfig.getDefaultTracking().setSessions(config.getBoolean("trackingSessionEvents"));
                }

                if (config.has("minTimeBetweenSessionsMillis")) {
                    amplitudeConfig.setMinTimeBetweenSessionsMillis(config.getLong("minTimeBetweenSessionsMillis"));
                }

                // Initialize Amplitude
                amplitude = new Amplitude(amplitudeConfig);

                // Set user ID if provided
                if (config.has("userId") && !config.getString("userId").isEmpty()) {
                    amplitude.setUserId(config.getString("userId"));
                }

                callbackContext.success("Amplitude initialized successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error initializing Amplitude", e);
                callbackContext.error("Error initializing Amplitude: " + e.getMessage());
            }
        });
    }

    private void track(String eventName, JSONObject properties, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                if (properties != null && properties.length() > 0) {
                    amplitude.track(eventName, convertToMap(properties));
                } else {
                    amplitude.track(eventName);
                }

                callbackContext.success("Event tracked successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error tracking event", e);
                callbackContext.error("Error tracking event: " + e.getMessage());
            }
        });
    }

    private void identify(String userId, JSONObject userProperties, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                if (userId != null && !userId.isEmpty()) {
                    amplitude.setUserId(userId);
                }

                if (userProperties != null && userProperties.length() > 0) {
                    Identify identify = new Identify();
                    Iterator<String> keys = userProperties.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        Object value = userProperties.get(key);
                        if (value instanceof String) {
                            identify.set(key, (String) value);
                        } else if (value instanceof Integer) {
                            identify.set(key, (Integer) value);
                        } else if (value instanceof Long) {
                            identify.set(key, (Long) value);
                        } else if (value instanceof Double) {
                            identify.set(key, (Double) value);
                        } else if (value instanceof Boolean) {
                            identify.set(key, (Boolean) value);
                        } else {
                            identify.set(key, value.toString());
                        }
                    }
                    amplitude.identify(identify);
                }

                callbackContext.success("User identified successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error identifying user", e);
                callbackContext.error("Error identifying user: " + e.getMessage());
            }
        });
    }

    private void setUserId(String userId, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                amplitude.setUserId(userId);
                callbackContext.success("User ID set successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error setting user ID", e);
                callbackContext.error("Error setting user ID: " + e.getMessage());
            }
        });
    }

    private void setUserProperties(JSONObject properties, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                if (properties != null && properties.length() > 0) {
                    Identify identify = new Identify();
                    Iterator<String> keys = properties.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        Object value = properties.get(key);
                        if (value instanceof String) {
                            identify.set(key, (String) value);
                        } else if (value instanceof Integer) {
                            identify.set(key, (Integer) value);
                        } else if (value instanceof Long) {
                            identify.set(key, (Long) value);
                        } else if (value instanceof Double) {
                            identify.set(key, (Double) value);
                        } else if (value instanceof Boolean) {
                            identify.set(key, (Boolean) value);
                        } else {
                            identify.set(key, value.toString());
                        }
                    }
                    amplitude.identify(identify);
                }

                callbackContext.success("User properties set successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error setting user properties", e);
                callbackContext.error("Error setting user properties: " + e.getMessage());
            }
        });
    }

    private void logRevenue(String productId, int quantity, double price, String revenueType, JSONObject properties, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                Revenue revenue = new Revenue();
                revenue.setProductId(productId);
                revenue.setQuantity(quantity);
                revenue.setPrice(price);

                if (revenueType != null && !revenueType.isEmpty()) {
                    revenue.setRevenueType(revenueType);
                }

                // Note: Android SDK does not support event properties on Revenue objects

                amplitude.revenue(revenue);

                callbackContext.success("Revenue logged successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error logging revenue", e);
                callbackContext.error("Error logging revenue: " + e.getMessage());
            }
        });
    }

    private void reset(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                amplitude.reset();
                callbackContext.success("User reset successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error resetting user", e);
                callbackContext.error("Error resetting user: " + e.getMessage());
            }
        });
    }

    private void setDeviceId(String deviceId, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                amplitude.setDeviceId(deviceId);
                callbackContext.success("Device ID set successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error setting device ID", e);
                callbackContext.error("Error setting device ID: " + e.getMessage());
            }
        });
    }

    private void getDeviceId(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                String deviceId = amplitude.getDeviceId();
                callbackContext.success(deviceId);
            } catch (Exception e) {
                Log.e(TAG, "Error getting device ID", e);
                callbackContext.error("Error getting device ID: " + e.getMessage());
            }
        });
    }

    private void getSessionId(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                long sessionId = amplitude.getSessionId();
                callbackContext.success(String.valueOf(sessionId));
            } catch (Exception e) {
                Log.e(TAG, "Error getting session ID", e);
                callbackContext.error("Error getting session ID: " + e.getMessage());
            }
        });
    }

    private void flush(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                if (amplitude == null) {
                    callbackContext.error("Amplitude not initialized");
                    return;
                }

                amplitude.flush();
                callbackContext.success("Events flushed successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error flushing events", e);
                callbackContext.error("Error flushing events: " + e.getMessage());
            }
        });
    }

    private Map<String, Object> convertToMap(JSONObject jsonObject) throws JSONException {
        Map<String, Object> map = new HashMap<>();
        if (jsonObject != null) {
            Iterator<String> keys = jsonObject.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                map.put(key, jsonObject.get(key));
            }
        }
        return map;
    }
}
