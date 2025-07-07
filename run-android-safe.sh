#!/bin/bash
# Script to run Android build with workarounds for Windows permission issues

export WATCHMAN_DISABLE=1
export REACT_EDITOR=none
export CI=true
export EXPO_NO_TELEMETRY=1

echo "Setting up environment variables to avoid file watching issues..."
echo "WATCHMAN_DISABLE=1"
echo "CI=true"

# Kill any existing Metro processes
pkill -f metro 2>/dev/null || true
pkill -f expo 2>/dev/null || true

# Clean and restart
echo "Cleaning previous Metro cache..."
npx expo r -c || true

# Start with modified environment
echo "Starting Android build..."
npx expo run:android --port 8084