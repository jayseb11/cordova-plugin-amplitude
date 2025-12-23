# Cordova Plugin Amplitude

A Cordova plugin for integrating Amplitude Analytics SDK into iOS and Android native applications.

## Installation

```bash
cordova plugin add cordova-plugin-amplitude
```

Or install from GitHub:

```bash
cordova plugin add https://github.com/jayseb11/cordova-plugin-amplitude.git
```

## Supported Platforms

- iOS (via AmplitudeSwift ~> 1.9)
- Android (via com.amplitude:analytics-android:1.+)

> **Note**: For web/browser support, use `@amplitude/analytics-browser` directly in your application instead of this Cordova plugin.

## API Reference

### Initialize

Initialize Amplitude with your API key. Call this once when your app starts.

```javascript
window.Amplitude.initialize({
  apiKey: 'YOUR_API_KEY',
  userId: 'optional-user-id',
  trackingSessionEvents: true,
  minTimeBetweenSessionsMillis: 300000
}).then(() => {
  console.log('Amplitude initialized');
}).catch(error => {
  console.error('Amplitude init error:', error);
});
```

**Config Options:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | string | Yes | Your Amplitude API key |
| `userId` | string | No | Optional user ID to set on init |
| `trackingSessionEvents` | boolean | No | Enable session tracking |
| `minTimeBetweenSessionsMillis` | number | No | Min time between sessions in ms |

### Track Event

Track a custom event with optional properties.

```javascript
window.Amplitude.track('Button Clicked', {
  buttonName: 'Submit',
  screen: 'Checkout',
  value: 99.99
}).then(() => {
  console.log('Event tracked');
});
```

### Identify User

Identify a user with user ID and properties.

```javascript
window.Amplitude.identify('user123', {
  email: 'user@example.com',
  plan: 'premium',
  signupDate: '2024-01-01'
}).then(() => {
  console.log('User identified');
});
```

### Set User ID

Set the user ID separately.

```javascript
window.Amplitude.setUserId('user123').then(() => {
  console.log('User ID set');
});
```

### Set User Properties

Set user properties without changing user ID.

```javascript
window.Amplitude.setUserProperties({
  plan: 'premium',
  trialExpires: '2024-12-31'
}).then(() => {
  console.log('User properties set');
});
```

### Log Revenue

Track a revenue event.

```javascript
window.Amplitude.logRevenue(
  'product_id',      // Product ID
  1,                 // Quantity
  9.99,              // Price
  'purchase',        // Revenue type (optional)
  { currency: 'USD' } // Additional properties (optional)
).then(() => {
  console.log('Revenue logged');
});
```

### Reset (Logout)

Reset the user session. Call this when a user logs out.

```javascript
window.Amplitude.reset().then(() => {
  console.log('User reset');
});
```

### Flush Events

Force flush events to Amplitude servers.

```javascript
window.Amplitude.flush().then(() => {
  console.log('Events flushed');
});
```

### Get Device ID

Get the current device ID.

```javascript
window.Amplitude.getDeviceId().then(deviceId => {
  console.log('Device ID:', deviceId);
});
```

### Get Session ID

Get the current session ID.

```javascript
window.Amplitude.getSessionId().then(sessionId => {
  console.log('Session ID:', sessionId);
});
```

### Set Device ID

Manually set the device ID.

```javascript
window.Amplitude.setDeviceId('custom-device-id').then(() => {
  console.log('Device ID set');
});
```

## Angular/Ionic Usage

For Angular/Ionic projects, create a service wrapper:

```typescript
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AmplitudeService {
  private isInitialized = false;

  constructor(private platform: Platform) {}

  async initialize(apiKey: string): Promise<void> {
    if (!this.platform.is('cordova')) return;

    await window.Amplitude.initialize({ apiKey });
    this.isInitialized = true;
  }

  async track(eventName: string, properties: any = {}): Promise<void> {
    if (!this.isInitialized) return;
    await window.Amplitude.track(eventName, properties);
  }

  // ... other methods
}
```

## Requirements

- Cordova >= 9.0.0
- cordova-ios >= 6.0.0
- cordova-android >= 9.0.0
- iOS 12.0+
- Android SDK 21+

## License

MIT

## Author

Gratitude - [https://365gratitudejournal.com](https://365gratitudejournal.com)
