# ChumsCheckin
Android app for self-checkin tablets at churches that prints name labels.  Visit <a href="https://chums.org/">CHUMS.org</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

## Depends on
* [AccessApi](https://github.com/LiveChurchSolutions/AccessApi)
* [AttendanceApi](https://github.com/LiveChurchSolutions/AttendanceApi)
* [MembershipApi](https://github.com/LiveChurchSolutions/MembershipApi)

## Dev Setup Instructions
For the APIs, you may either set them up on your local machine first, or point to the staging server copies during development.  The staging server urls are in the sample dotenv file.

### ChumsCheckin
1. Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls. 
2. Run `npm start` to start the React Native server.
3. In Android Studio open the /android folder and click the run button to install the app on your device.  It will initially load with the logo missing, you need to connect it to the ReactNative server.
4. Connec the app to your react native server by either shaking the device or running `adb shell input keyevent 82` to open the developer menu. Go to settings, Debug server host and enter YourIP:8081.  Restart the app and it should work properly.
