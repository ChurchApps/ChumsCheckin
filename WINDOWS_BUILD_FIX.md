# Windows Build Fix Guide

## Issue
`EACCES: permission denied, lstat 'E:\LCS\Chums\ChumsCheckin\node_modules\.bin\.acorn-ueec1v5K'`

## Quick Fix (Run in Command Prompt as Administrator)

### Option 1: Use PowerShell Script
```powershell
# Run as Administrator
PowerShell -ExecutionPolicy Bypass -File fix-windows-build.ps1
```

### Option 2: Use Batch File
```cmd
# Run as Administrator
fix-windows-build.bat
```

### Option 3: Manual Steps
```cmd
# 1. Kill existing processes
taskkill /f /im node.exe

# 2. Clean directories
rmdir /s /q node_modules\.bin
rmdir /s /q .expo
rmdir /s /q android\app\build

# 3. Set environment variables
set WATCHMAN_DISABLE=1
set CI=true
set EXPO_NO_TELEMETRY=1

# 4. Try build
npm run android-windows
```

## Alternative Build Commands

Try these in order:

```cmd
# Option 1: Windows-specific script
npm run android-windows

# Option 2: Cross-platform safe script
npm run android-safe

# Option 3: Direct npx with port
npx expo run:android --port 8085

# Option 4: Different port
npx expo run:android --port 8086

# Option 5: No cache
npx expo run:android --port 8087 --clear
```

## If Still Having Issues

### 1. Install Expo CLI Globally
```cmd
npm install -g @expo/cli@latest
```

### 2. Use EAS Build (Cloud)
```cmd
npm install -g eas-cli
eas login
eas build --platform android --profile development
```

### 3. Alternative Development Method
```cmd
# Start development server only
npx expo start --localhost --port 8088

# Then manually connect device:
# - Scan QR code with Expo Go app
# - Or use USB debugging with adb
```

### 4. Windows Subsystem for Linux (WSL)
If all else fails, consider using WSL2:
```bash
# In WSL2
cd /mnt/e/LCS/Chums/ChumsCheckin
npm install
npm run android
```

## Verification Steps

1. **Check if build succeeded**:
   ```cmd
   dir android\app\build\outputs\apk\debug\
   ```

2. **Install APK manually**:
   ```cmd
   adb install android\app\build\outputs\apk\debug\app-debug.apk
   ```

3. **Check device connection**:
   ```cmd
   adb devices
   ```

## Root Cause
Windows file system permissions conflict with Metro's file watcher trying to access temporary files in `node_modules\.bin\`. The fixes disable file watching and use alternative Metro configurations.

## Success Indicators
- ✅ Build completes without EACCES errors
- ✅ APK file created in android/app/build/outputs/apk/debug/
- ✅ App installs and runs on device/emulator