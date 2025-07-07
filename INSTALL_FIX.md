# Installation Fix Guide

## Issue
```
ERESOLVE could not resolve
react-test-renderer@19.1.0 conflicts with react@19.0.0
```

## Quick Fixes (try in order)

### Option 1: Use Installation Scripts
```cmd
# PowerShell (recommended)
PowerShell -ExecutionPolicy Bypass -File install-windows.ps1

# Or Batch file
install-windows.bat
```

### Option 2: Manual Clean Install
```cmd
# Clean everything
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Option 3: Force Install
```cmd
npm install --legacy-peer-deps --force
```

### Option 4: Use npm scripts
```cmd
npm run install:clean
# or
npm run install:force
```

## What Was Fixed

1. **Version Alignment**: 
   - Changed `react-test-renderer` from `19.1.0` to `19.0.0`
   - Updated `@types/react-test-renderer` to match

2. **Added Resolutions**: 
   - Forces all packages to use React 19.0.0
   - Prevents version conflicts in nested dependencies

3. **Installation Scripts**:
   - Clean install process
   - Automatic legacy peer deps handling

## Verification

After installation, check:
```cmd
npm list react react-test-renderer
```

Should show:
```
react@19.0.0
react-test-renderer@19.0.0
```

## If Still Having Issues

Try these in order:

1. **Update npm**:
   ```cmd
   npm install -g npm@latest
   ```

2. **Clear global cache**:
   ```cmd
   npm cache clean --force
   npm config cache
   ```

3. **Use Yarn instead**:
   ```cmd
   npm install -g yarn
   yarn install
   ```

4. **Node version check**:
   ```cmd
   node --version
   # Should be 18.x or 20.x
   ```

## Success Indicators
- ✅ No ERESOLVE errors
- ✅ All packages installed
- ✅ React versions aligned
- ✅ Ready to run `npm run android-windows`