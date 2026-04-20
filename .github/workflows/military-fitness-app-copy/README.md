# Military Fitness Hub

A browser-based fitness tracking app for physical and combat fitness tests, AI training plans, and meal planning.

## Features

- Dashboard with profile fields and quick navigation.
- Physical fitness test logging for 3-mile run, plank, and pull-ups.
- Combat fitness test logging for MUF, 880m run, and ammo can lifts.
- Timestamped history for each test type.
- Performance graphs for all tracked metrics.
- AI-assisted training plan generation based on weak events.
- AI meal plan recommendations for fat loss, performance, or maintenance goals.
- Document management for medical records and certifications.
- Health Tracker for water intake and sleep duration with trend visualization.
- PWA-ready manifest and service worker for offline support.
- Capacitor packaging support for Android and iOS.

## Usage

1. Open `index.html` in a browser.
2. Save your profile information.
3. Use the navigation buttons to log physical and combat entries.
4. View history and chart progress under Performance Graphs.
5. Generate weekly training and meal plans using the AI pages.

## Packaging for mobile

1. Install dependencies:
   - `npm install`
2. Initialize Capacitor if needed:
   - `npm run install:capacitor`
3. Add a native platform:
   - `npm run cap:add-android`
   - `npm run cap:add-ios`
4. Copy the web app into the native project:
   - `npm run cap:copy`
5. Open the native project with Android Studio or Xcode and build from there.

## Run locally

Use the launcher script for a ready-to-run local app server:
- `run-app.bat`
- `run-app.ps1`

## Notes

- Data is stored locally using `localStorage`.
- AI plan generation is currently simulated in the browser.
- Replace the placeholder AI logic with real API calls for live endpoint integration.

## Release resources

- See `release-checklist.md` for a step-by-step mobile release workflow.
- See `store-listing-template.md` for Google Play and App Store listing copy.
- For App Store / Play Store release, create platform-specific app icons, privacy policy, and store listing assets.
