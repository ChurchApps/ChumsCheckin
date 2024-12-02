<img align="right" width="150" src="https://raw.githubusercontent.com/ChurchApps/ChumsApp/main/public/images/logo.png">

# CHUMS Checkin

> CHUMS Checkin is an Android app companion for the church management software CHUMS.  It's for use on self-checkin tablets at churches that prints name labels and parent pickup slips with unique id codes to ensure children are matched with the correct parents. Visit <a href="https://chums.org/">CHUMS.org</a> to learn more.


## Preview

<div style="display: flex;gap: 10px;">
    <img style="width: 25%;" src="https://github.com/ChurchApps/ChumsCheckin/assets/1447203/f1d9e5e3-0a43-4566-88d5-ed094f862732">
    <img style="width: 25%;" src="https://github.com/ChurchApps/ChumsCheckin/assets/1447203/c0d6aa1c-8957-4096-9e5e-80f429873a31">
</div>

## Get Involved

### 🤝 Help Support Us

The only reason this program is free is because of the generous support from users. If you want to support us to keep this free, please head over to [ChurchApps](https://churchapps/partner) or [sponsor us on GitHub](https://github.com/sponsors/ChurchApps/). Thank you so much!

### 🏘️ Join the Community

We have a great community for end-users on [Facebook](https://www.facebook.com/churchapps.org). It's a good way to ask questions, get tips and follow new updates. Come join us!

### ⚠️ Report an Issue

If you discover an issue or have a feature request, simply submit it to our [issues log](https://github.com/ChurchApps/ChurchAppsSupport/issues). Don't be shy, that's how the program gets better.

### 💬 Join us on Slack

If you would like to contribute in any way, head over to our [Slack Channel](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg) and introduce yourself. We'd love to hear from you.

### 🏗️ Start Coding

If you'd like to set up the project locally, see our [development guide](https://churchapps.org/dev).  The short version is:

1. **Prerequisite** First set follow the setup instructions for [CHUMS](https://github.com/ChurchApps/ChumsApp)
2. **Install** the dependencies with: `npm install`
4. **Configure** - Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls. On env changes please restart the server with `npm start -- --reset-cache`. For the cases when connecting to local running apis, use system's ip (192.---.-.---) instead of `localhost`.
5. **Start React Native** - Run `npm start` to start the React Native server.
6. **Install Android App** - In Android Studio open the /android folder and click the run button to install the app on your device. It will initially load with the logo missing, you need to connect it to the ReactNative server.
7. **Connect App to React Native** - Either shake the device or run `adb shell input keyevent 82` to open the developer menu. Go to settings, Debug server host and enter YourIP:8081. Restart the app and it should work properly.

### Connect Debugger

To debug within VSCode, set breakpoints like normal, then:

1. Click on the Run and Debug tab on the left of VSCode.
2. Click the Play button with the Attach to packager option
3. From the Metro command prompt window, press the D button to start debugging.
4. The program will now pause at your breakpoints.

## Release build

1. Hardcode stage to prod EnvironmentHelper.ts
2. Increment the version number in android/app/build.gradle
3. Update version number in package.json
4. Run `cd android` followed by `gradlew bundleRelease` to produce the release bundle.
5. Plug in an Amazon fire tablet via USB so an apk is generated for the correct device.
6. Run `cd..` followed by `react-native run-android --variant=release` to generate an apk file for Fire devices. You can close the node window when it completes.
7. The apk file is located at `android/app/build/outputs/apk/release/app-release.apk`. Publish it via the Amazon developer portal.
8. Open Android Studio, Go to Build->Generate Signed Bundle.
9. The bundle aab is located at `android/app/release`. Publish it to Google Play Store.
10. Remove hardcoded stage in EnvironmentHelper.ts

## Codepush release

1. Hardcode stage to prod EnvironmentHelper.ts
2. Update version number in package.json
3. Run `appcenter codepush release-react -a Live-Church-Solutions/ChumsCheckin -d Production`
4. Remove hardcoded stage in EnvironmentHelper.ts
