# ChumsCheckin
Android app for self-checkin tablets at churches that prints name labels.  Visit <a href="https://chums.org/">CHUMS.org</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

## Dev Setup Instructions

### CHUMS Setup
1. **Install APIs** - This project dependings on the following APIs: [AttendanceApi](https://github.com/LiveChurchSolutions/AttendanceApi), [MembershipApi](https://github.com/LiveChurchSolutions/MembershipApi).  The easiest way to get these set up on your local machine is to use the [CHUMS Dev Docker Image](https://github.com/LiveChurchSolutions/Docker).  
2. **Register** - After getting the Docker container running, go to [http://localhost:3100](http://localhost:3100) to register an account on your local copy.  
3. **Import Sample Data** - Log into [http://localhost:3101](http://localhost:3101) with the account you created and go to Settings -> Import Data.  Download the sample .zip and upload it to create sample data.

### ChumsCheckin Setup
4. **Configure** - Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls. On env changes please restart the server with `npm start -- --reset-cache`. For the cases when connecting to local running apis, use system's ip (192.---.-.---) instead of `localhost`.
5. **Start React Native** - Run `npm start` to start the React Native server.
6. **Install Android App** - In Android Studio open the /android folder and click the run button to install the app on your device.  It will initially load with the logo missing, you need to connect it to the ReactNative server.
7. **Connect App to React Native** - Either shake the device or run `adb shell input keyevent 82` to open the developer menu. Go to settings, Debug server host and enter YourIP:8080.  Restart the app and it should work properly.

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
4. Run 'cd android' followed by 'gradlew bundleRelease' to produce the release bundle.
5. Plug in an Amazon fire tablet via USB so an apk is generated for the correct device.
6. Run 'cd..' followed by 'react-native run-android --variant=release' to generate an apk file for Fire devices.  You can close the node window when it completes.
7. The apk file is located at 'android/app/build/outputs/apk/release/app-release.apk'.  Publish it via the Amazon developer portal.
8. Open Android Studio, Go to Build->Generate Signed Bundle.
9. The bundle aab is located at 'android/app/release'.  Publish it to Google Play Store.
8. Remove hardcoded stage in EnvironmentHelper.ts

## Codepush release
1. Hardcode stage to prod EnvironmentHelper.ts
2. Update version number in package.json
3. Run 'appcenter codepush release-react -a Live-Church-Solutions/ChumsCheckin -d Production'
4. Remove hardcoded stage in EnvironmentHelper.ts