---
description: How to export and build the app for Android and iOS
---

# Exporting for Android and iOS

This workflow guides you through building your React Native app for Android and iOS using EAS (Expo Application Services).

## Prerequisites

1.  **Expo Account**: You need an account at [expo.dev](https://expo.dev).
2.  **EAS CLI**: Install the EAS CLI globally.

## Steps

### 1. Install EAS CLI
If you haven't installed it yet:
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS
Initialize the project with EAS. This will create an `eas.json` file.
```bash
cd mobile_app
eas build:configure
```
Select `All` when asked which platforms to configure.

### 4. Build for Android (APK)
To build an APK for testing on a device (side-loading):
1.  Open `eas.json` and add a `preview` profile if it doesn't exist, or modify the `build` section:
    ```json
    {
      "build": {
        "preview": {
          "android": {
            "buildType": "apk"
          }
        },
        "production": {}
      }
    }
    ```
2.  Run the build command:
    ```bash
    eas build -p android --profile preview
    ```

### 5. Build for iOS (Simulator)
To build for the iOS Simulator (no Apple Developer account needed):
1.  Update `eas.json`:
    ```json
    {
      "build": {
        "preview": {
          "ios": {
            "simulator": true
          }
        }
      }
    }
    ```
2.  Run the build command:
    ```bash
    eas build -p ios --profile preview
    ```

### 6. Build for App Stores (Production)
To build for Google Play Store or Apple App Store:
```bash
eas build -p android --profile production
eas build -p ios --profile production
```
*Note: For iOS production builds, you need a paid Apple Developer Account.*

## Local Builds (Optional)
If you prefer to build locally on your machine (requires Android Studio / Xcode):
```bash
eas build --local -p android --profile preview
eas build --local -p ios --profile preview
```
