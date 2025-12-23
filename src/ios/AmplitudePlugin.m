#import "AmplitudePlugin.h"
@import AmplitudeSwift;

@interface AmplitudePlugin ()
@property (nonatomic, strong) Amplitude *amplitude;
@end

@implementation AmplitudePlugin

- (void)initialize:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        NSDictionary *config = [command.arguments objectAtIndex:0];
        NSString *apiKey = config[@"apiKey"];

        if (!apiKey || [apiKey length] == 0) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"API key is required"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        // Create configuration using the correct initializer
        Configuration *amplitudeConfig = [[Configuration alloc] initWithApiKey:apiKey];

        // Set optional configuration
        if (config[@"minTimeBetweenSessionsMillis"]) {
            amplitudeConfig.minTimeBetweenSessionsMillis = [config[@"minTimeBetweenSessionsMillis"] integerValue];
        }

        // Initialize Amplitude
        self.amplitude = [[Amplitude alloc] initWithConfiguration:amplitudeConfig];

        // Set user ID if provided
        if (config[@"userId"] && [config[@"userId"] length] > 0) {
            [self.amplitude setUserId:config[@"userId"]];
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Amplitude initialized successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)track:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *eventName = [command.arguments objectAtIndex:0];
        NSDictionary *properties = [command.arguments objectAtIndex:1];

        // Use the track method with eventType and eventProperties
        if (properties && [properties count] > 0) {
            [self.amplitude trackWithEventType:eventName eventProperties:properties];
        } else {
            [self.amplitude trackWithEventType:eventName];
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Event tracked successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)identify:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *userId = [command.arguments objectAtIndex:0];
        NSDictionary *userProperties = [command.arguments objectAtIndex:1];

        if (userId && [userId length] > 0) {
            [self.amplitude setUserId:userId];
        }

        if (userProperties && [userProperties count] > 0) {
            Identify *identifyObj = [[Identify alloc] init];
            for (NSString *key in userProperties) {
                [identifyObj setWithProperty:key value:userProperties[key]];
            }
            [self.amplitude identifyWithIdentify:identifyObj];
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"User identified successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)setUserId:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *userId = [command.arguments objectAtIndex:0];
        [self.amplitude setUserId:userId];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"User ID set successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)setUserProperties:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSDictionary *properties = [command.arguments objectAtIndex:0];

        if (properties && [properties count] > 0) {
            Identify *identifyObj = [[Identify alloc] init];
            for (NSString *key in properties) {
                [identifyObj setWithProperty:key value:properties[key]];
            }
            [self.amplitude identifyWithIdentify:identifyObj];
        }

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"User properties set successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)logRevenue:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *productId = [command.arguments objectAtIndex:0];
        NSNumber *quantity = [command.arguments objectAtIndex:1];
        NSNumber *price = [command.arguments objectAtIndex:2];
        NSString *revenueType = command.arguments.count > 3 ? [command.arguments objectAtIndex:3] : nil;

        Revenue *revenueObj = [[Revenue alloc] init];
        revenueObj.productId = productId;
        revenueObj.quantity = [quantity integerValue];
        revenueObj.price = [price doubleValue];

        if (revenueType && ![revenueType isEqual:[NSNull null]] && [revenueType length] > 0) {
            revenueObj.revenueType = revenueType;
        }

        [self.amplitude revenueWithRevenue:revenueObj];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Revenue logged successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)reset:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        [self.amplitude reset];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"User reset successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)setDeviceId:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *deviceId = [command.arguments objectAtIndex:0];
        [self.amplitude setDeviceId:deviceId];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Device ID set successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)getDeviceId:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSString *deviceId = [self.amplitude getDeviceId];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:deviceId];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)getSessionId:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        NSInteger sessionId = [self.amplitude getSessionId];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)sessionId];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)flush:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if (!self.amplitude) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Amplitude not initialized"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }

        [self.amplitude flush];

        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Events flushed successfully"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

@end
