# Veza iOS app

Veza is an Expo + React Native app. The iOS target is configured with bundle identifier `com.simpleai.veza`.

## Build an iOS IPA with Codemagic

The included `codemagic.yaml` generates the native iOS project, installs CocoaPods dependencies, applies App Store signing, and exports an IPA:

1. Push this project to a GitHub repository.
2. Add the repository in Codemagic and select the branch containing `codemagic.yaml`.
3. Add an Apple Distribution certificate and App Store provisioning profile for `com.simpleai.veza` in Codemagic Code signing identities.
4. Start the `veza-ios-appstore` workflow.

The workflow keeps the signed `.ipa` as a downloadable build artifact. The App Store Connect app record and signing profile must use the same bundle identifier.

## Build with EAS instead

If you prefer EAS, connect the app with `npx eas-cli@latest init`, then run `npm run build:ios -- --profile production`.

## Run in the iOS simulator

On macOS with Xcode installed, run `npm install` and then `npm run run:ios`.

## App Store submission

The current Codemagic workflow builds the signed IPA but does not upload it automatically. TestFlight or App Store upload can be enabled after the App Store Connect record and Codemagic App Store Connect integration are configured.

## Current app behavior

This bundle is a runnable mobile prototype. Its account and interaction data are stored on the device; it does not yet use a production authentication or shared backend service.
