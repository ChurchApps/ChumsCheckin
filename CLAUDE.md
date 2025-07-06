# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHUMS Checkin is a React Native Expo app for church check-in kiosks. It prints name labels and parent pickup slips with unique ID codes to ensure children are matched with correct parents. The app connects to CHUMS church management APIs.

## Common Development Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version
- `npm run reset-project` - Reset project state

### Testing & Linting
- `npm test` - Run Jest tests with watch mode
- `npm run lint` - Run Expo linting

### Building
- `npm run build:android` - Build production Android APK via EAS
- `npm run build:amazon` - Build Amazon-specific Android APK via EAS

### Release Process
1. Update stage to "prod" in `src/helpers/EnvironmentHelper.ts:17`
2. Increment version in `android/app/build.gradle` and `package.json`
3. Run build commands above

## Architecture

### Navigation & Routing
- Uses Expo Router with file-based routing in `/app` directory
- Main app entry point: `app/index.tsx` (Splash screen)
- Navigation stack defined in `app/_layout.tsx`
- Key screens: login → selectChurch → services → household → checkinComplete

### State Management
- Global state managed via `CachedData` class in `src/helpers/CachedData.ts`
- AsyncStorage for persistent data (login credentials, printer settings, church appearance)
- No Redux/Context - uses singleton pattern for shared state

### API Integration
- Uses `@churchapps/mobilehelper` package for API calls
- Environment configuration in `src/helpers/EnvironmentHelper.ts`
- Supports dev/staging/prod environments
- Main APIs: MembershipApi, AttendanceApi
- API configuration set via `ApiHelper.apiConfigs`

### Core Data Models
- `VisitInterface` - Check-in visits (pending and existing)
- `PersonInterface` - Household members
- `ServiceTimeInterface` - Service times and groups
- `AppearanceInterface` - Church branding/theming
- `AvailablePrinter` - Printer configuration

### Printing System
- Native Android printing via `NativeModules.PrinterHelper`
- HTML-to-image conversion using `react-native-view-shot`
- WebView renders HTML labels before capture
- Supports Brother and PrintHand printer providers
- Label templates in `/assets/labels/` (HTML files)
- Print workflow: HTML → WebView → Screenshot → Native print

### Key Helper Classes
- `VisitHelper` - Check-in visit management
- `VisitSessionHelper` - Session state management  
- `LabelHelper` - Label generation and formatting
- `Utilities` - Common utility functions
- `Styles` - Shared styling constants

### Error Handling
- Global error boundary with `ErrorFallback` component
- Firebase analytics integration via `FirebaseHelper`
- Exception handling via `react-native-exception-handler`

### Development Setup Notes
- Copy `dotenv.sample.txt` to `.env` for local API configuration
- Use system IP (192.x.x.x) instead of localhost for local APIs
- Restart with `npm start -- --reset-cache` after env changes
- Android debugging: shake device or `adb shell input keyevent 82` for dev menu

### File Structure
- `/app` - Expo Router screens and components
- `/src/helpers` - Core business logic and utilities  
- `/android` - Native Android code and printing providers
- `/assets` - Images, fonts, and label templates
- `/components` - Reusable React components (legacy, prefer `/app/components`)

### Print Providers (Android Native)
- `BrotherProvider.java` - Brother printer integration
- `PrintHandProvider.java` - PrintHand app integration
- `PrintProviderInterface.java` - Common printer interface
- All printing goes through `PrinterHelper.java` → `PrintHelperPackage.kt`

## Testing Strategy
- Jest configuration with `jest-expo` preset
- Component tests in `components/__tests__/`
- Snapshots for UI regression testing
- Manual testing on physical devices for printing functionality