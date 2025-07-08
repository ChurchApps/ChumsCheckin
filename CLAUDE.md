# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHUMS Checkin is a React Native/Expo self-checkin kiosk application for churches. It allows families to check in at services, prints name tags and parent pickup slips, and integrates with the CHUMS church management system.

## Development Commands

### Core Development
- `npm install` - Install dependencies
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version
- `npm start -- --reset-cache` - Start with cache reset (required after env changes)

### Code Quality
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests with watch mode

### Building & Deployment
- `npm run build:android` - EAS build for Google Play
- `npm run build:amazon` - EAS build for Amazon Appstore

## Architecture Overview

### Technology Stack
- **React Native** with **Expo SDK 53**
- **Expo Router** for file-based routing
- **TypeScript** with strict mode
- **EAS Build** for distribution
- **AsyncStorage** for local data persistence

### Project Structure
```
app/                    # Expo Router pages (file-based routing)
├── _layout.tsx         # Root layout with Stack navigator
├── index.tsx           # Splash screen (entry point)
├── login.tsx           # Authentication
├── selectChurch.tsx    # Church selection
├── services.tsx        # Service selection
├── household.tsx       # Household member selection
└── checkinComplete.tsx # Check-in completion

src/
├── components/         # Reusable business components
├── helpers/           # Business logic and utilities
├── @types/           # TypeScript definitions
└── images/           # Assets
```

### Key Helper Classes

#### `EnvironmentHelper`
- Manages environment configuration (dev/staging/prod)
- Currently hardcoded to "prod" in line 17
- Use `initDev()` for local development with `.env` file

#### `ApiHelper`
- Centralized HTTP client with JWT authentication
- Supports multiple APIs: MembershipApi, AttendanceApi
- Handles church-specific API configurations

#### `CachedData`
- Global state management for app data
- Stores user session, selected church, services, etc.
- Used throughout the app for data persistence

#### `VisitHelper/VisitSessionHelper`
- Manages attendance tracking
- Handles check-in/check-out operations
- Integrates with label printing

### Navigation Flow
1. **Splash** (`index.tsx`) → **Login** → **Church Selection** → **Services** → **Household** → **Check-in Complete**
2. Uses Expo Router with typed navigation parameters
3. Navigation state managed through `CachedData`

### Component Patterns

#### Layout Components
- `Header` - Main header with logo and printer status
- `Subheader` - Reusable light blue section boxes (icon, title, subtitle)
- Both use `DimensionHelper.wp()` for responsive sizing

#### Styling Conventions
- `StyleConstants` for consistent colors and fonts
- `DimensionHelper` for responsive dimensions
- Material Design card patterns with shadows and rounded corners

### Configuration Setup

#### Environment Variables
Copy `dotenv.sample.txt` to `.env` for local development:
```
CONTENT_ROOT=https://content.staging.churchapps.org
MEMBERSHIP_API=https://membershipapi.staging.churchapps.org
ATTENDANCE_API=https://attendanceapi.staging.churchapps.org
```

#### Debug Configuration
- VSCode debugging: Use "Attach to packager" configuration
- Device debugging: Shake device or `adb shell input keyevent 82`
- Metro debugging: Press 'D' in Metro console

### API Integration

#### Multiple API Architecture
- **MembershipApi** - User authentication, church data, household management
- **AttendanceApi** - Service data, check-in operations, visit tracking

#### Authentication Flow
1. User login → JWT token received
2. Church selection → API configurations updated with church-specific endpoints
3. All subsequent API calls use church-scoped authentication

### Printing System
- Label templates in `/assets/labels/`
- Support for multiple label sizes (1"x3.5", 6"x4")
- Parent pickup slips with unique ID codes
- Native Android printing integration

### Type Safety
- Comprehensive interfaces in `src/helpers/Interfaces.ts`
- Navigation parameters typed in `src/screenList.ts`
- API responses fully typed

### Development Notes

#### Common Issues
- After changing environment variables, restart with `npm start -- --reset-cache`
- For local API connections, use system IP (192.x.x.x) instead of localhost
- Ensure Android Studio project is opened from `/android` folder

#### Code Quality
- ESLint configured for React Native
- TypeScript strict mode enabled
- Consistent component patterns with hooks and functional components

#### Release Process
1. Update `EnvironmentHelper.ts` stage to "prod"
2. Increment version in `android/app/build.gradle` and `package.json`
3. Run `npm run build:android` for Google Play
4. Run `npm run build:amazon` for Amazon Appstore