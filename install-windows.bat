@echo off
echo Installing dependencies for Windows...

REM Clean existing installations
echo Cleaning existing node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Install with legacy peer deps to handle React version conflicts
echo Installing dependencies with legacy peer deps...
npm install --legacy-peer-deps

echo Installation complete!
echo You can now run: npm run android-windows