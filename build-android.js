const { execSync } = require('child_process');
const path = require('path');

console.log('Building Android APK...');

try {
  // Clean previous builds
  console.log('Cleaning previous builds...');
  execSync('rm -rf android/app/build', { stdio: 'inherit' });
  
  // Create bundle directory
  const bundleDir = 'android/app/src/main/assets';
  execSync(`mkdir -p ${bundleDir}`, { stdio: 'inherit' });
  
  // Create JS bundle without file watching
  console.log('Creating JavaScript bundle...');
  execSync(`npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output ${bundleDir}/index.android.bundle --assets-dest android/app/src/main/res/`, { 
    stdio: 'inherit',
    env: { ...process.env, WATCHMAN_DISABLE: '1' }
  });
  
  console.log('Bundle created successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}