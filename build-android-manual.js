#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Manual Android Build Script for Windows');
console.log('==========================================');

try {
  // Set environment variables
  process.env.WATCHMAN_DISABLE = '1';
  process.env.CI = 'true';
  process.env.EXPO_NO_TELEMETRY = '1';
  process.env.REACT_EDITOR = 'none';

  console.log('✅ Environment variables set');

  // Create bundle directory
  const bundleDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets');
  const bundlePath = path.join(bundleDir, 'index.android.bundle');

  if (!fs.existsSync(bundleDir)) {
    fs.mkdirSync(bundleDir, { recursive: true });
    console.log('✅ Created bundle directory');
  }

  // Create React Native bundle
  console.log('📦 Creating React Native bundle...');
  execSync(
    `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output "${bundlePath}" --assets-dest android/app/src/main/res/`,
    { 
      stdio: 'inherit',
      cwd: __dirname,
      env: process.env
    }
  );

  console.log('✅ Bundle created successfully');

  // Build APK using Gradle (if available)
  console.log('🏗️  Building APK...');
  try {
    execSync('cd android && .\\gradlew assembleDebug', { 
      stdio: 'inherit',
      shell: true
    });
    console.log('✅ APK built successfully!');
    console.log('📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk');
  } catch (gradleError) {
    console.log('⚠️  Gradle build failed - bundle created but APK build requires Android SDK');
    console.log('   You can use the bundle with: npx expo run:android');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('\n🔧 Try these alternatives:');
  console.log('1. npm run android-windows');
  console.log('2. npm run android-safe');
  console.log('3. Use EAS Build: eas build --platform android');
  process.exit(1);
}