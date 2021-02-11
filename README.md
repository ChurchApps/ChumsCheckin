# ChumsCheckin
Android app for self-checkin tablets at churches that prints name labels.  Visit <a href="https://chums.org/">CHUMS.org</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

## Dev Setup Instructions

### CHUMS Setup
1. **Install APIs** - This project dependings on the following APIs: [AccessApi](https://github.com/LiveChurchSolutions/AccessApi), [AttendanceApi](https://github.com/LiveChurchSolutions/AttendanceApi), [MembershipApi](https://github.com/LiveChurchSolutions/MembershipApi).  The easiest way to get these set up on your local machine is to use the [CHUMS Dev Docker Image](https://github.com/LiveChurchSolutions/Docker).  
2. **Register** - After getting the Docker container running, go to [http://localhost:3100](http://localhost:3100) to register an account on your local copy.  
3. **Import Sample Data** - Log into [http://localhost:3101](http://localhost:3101) with the account you created and go to Settings -> Import Data.  Download the sample .zip and upload it to create sample data.

### ChumsCheckin Setup
4. **Configure** - ~~Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls.~~
5. **Start React Native** - Run `npm start` to start the React Native server.
6. **Install Android App** - In Android Studio open the /android folder and click the run button to install the app on your device.  It will initially load with the logo missing, you need to connect it to the ReactNative server.
7. **Connect App to React Native** - Either shake the device or run `adb shell input keyevent 82` to open the developer menu. Go to settings, Debug server host and enter YourIP:8080.  Restart the app and it should work properly.
