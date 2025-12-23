#import <Cordova/CDVPlugin.h>

@interface AmplitudePlugin : CDVPlugin

- (void)initialize:(CDVInvokedUrlCommand*)command;
- (void)track:(CDVInvokedUrlCommand*)command;
- (void)identify:(CDVInvokedUrlCommand*)command;
- (void)setUserId:(CDVInvokedUrlCommand*)command;
- (void)setUserProperties:(CDVInvokedUrlCommand*)command;
- (void)logRevenue:(CDVInvokedUrlCommand*)command;
- (void)reset:(CDVInvokedUrlCommand*)command;
- (void)setDeviceId:(CDVInvokedUrlCommand*)command;
- (void)getDeviceId:(CDVInvokedUrlCommand*)command;
- (void)getSessionId:(CDVInvokedUrlCommand*)command;
- (void)flush:(CDVInvokedUrlCommand*)command;

@end
