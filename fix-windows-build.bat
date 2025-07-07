@echo off
echo Fixing Windows build issues for ChumsCheckin...

REM Kill any running Metro processes
echo Killing existing Metro processes...
taskkill /f /im node.exe 2>nul

REM Clean problematic directories
echo Cleaning build directories...
if exist node_modules\.bin rmdir /s /q node_modules\.bin
if exist .expo rmdir /s /q .expo
if exist android\app\build rmdir /s /q android\app\build
if exist android\build rmdir /s /q android\build

REM Recreate .bin directory with proper permissions
echo Recreating node_modules\.bin...
mkdir node_modules\.bin 2>nul

REM Clear Metro cache
echo Clearing Metro cache...
npx react-native start --reset-cache --port 8081 & timeout /t 5 & taskkill /f /im node.exe 2>nul

REM Set environment variables for this session
echo Setting environment variables...
set WATCHMAN_DISABLE=1
set CI=true
set EXPO_NO_TELEMETRY=1
set REACT_EDITOR=none

echo Done! Now try running: npx expo run:android --port 8085