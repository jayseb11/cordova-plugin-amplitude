#!/usr/bin/env node

/**
 * Fix Podfile iOS deployment target before pod install.
 * cordova-ios 8 defaults to iOS 12.0 which is too low for AmplitudeSwift.
 */

var fs = require('fs');
var path = require('path');

module.exports = function(context) {
    var podfilePath = path.join(context.opts.projectRoot, 'platforms', 'ios', 'Podfile');

    if (!fs.existsSync(podfilePath)) {
        return;
    }

    var podfileContent = fs.readFileSync(podfilePath, 'utf8');
    var targetVersion = '15.0';
    var oldPattern = /platform :ios, '[\d.]+'/;
    var newPlatform = "platform :ios, '" + targetVersion + "'";

    if (podfileContent.match(oldPattern)) {
        var currentMatch = podfileContent.match(oldPattern)[0];
        if (currentMatch !== newPlatform) {
            podfileContent = podfileContent.replace(oldPattern, newPlatform);
            fs.writeFileSync(podfilePath, podfileContent);
            console.log('AmplitudePlugin: Updated Podfile iOS deployment target to ' + targetVersion);
        }
    }
};
