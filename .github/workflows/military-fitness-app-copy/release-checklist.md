# Release Checklist

## Environment setup
- [ ] Install Node.js and npm
- [ ] Run `npm install` in `military-fitness-app`
- [ ] Verify `npm run serve` works locally
- [ ] Verify Capacitor is installed and configured

## Package native apps
- [ ] Run `.uild-mobile.ps1 -Android -iOS`
- [ ] Confirm `android/` and `ios/` folders are created
- [ ] Open `android/` in Android Studio
- [ ] Open `ios/App/App.xcworkspace` in Xcode

## Android release
- [ ] Generate a keystore or use Google Play App signing
- [ ] Configure `android/app/build.gradle` with signing config
- [ ] Build a release AAB in Android Studio
- [ ] Test the signed app on physical devices
- [ ] Create a Google Play developer account if needed
- [ ] Upload the AAB to Google Play Console
- [ ] Fill in store listing details and privacy policy
- [ ] Complete content rating questionnaire
- [ ] Submit release for review

## iOS release
- [ ] Create an Apple Developer account
- [ ] Configure app identifiers and provisioning profiles
- [ ] Set app version and build number in Xcode
- [ ] Archive a release build in Xcode
- [ ] Validate and export the App Store package
- [ ] Test the app on a device or TestFlight
- [ ] Upload the build to App Store Connect
- [ ] Create App Store listing, screenshots, and privacy policy
- [ ] Submit the app for review

## Post-release
- [ ] Monitor review status in each console
- [ ] Address any review feedback or required fixes
- [ ] Release updates if necessary
- [ ] Keep app metadata and privacy policy current
