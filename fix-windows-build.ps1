# PowerShell script to fix Windows Metro file watcher issues

Write-Host "Fixing Windows build issues for ChumsCheckin..." -ForegroundColor Green

# Stop any running Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean problematic directories
Write-Host "Cleaning build directories..." -ForegroundColor Yellow
if (Test-Path "node_modules\.bin") { 
    Remove-Item -Recurse -Force "node_modules\.bin" -ErrorAction SilentlyContinue
}
if (Test-Path ".expo") { 
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue 
}
if (Test-Path "android\app\build") { 
    Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue 
}
if (Test-Path "android\build") { 
    Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue 
}

# Recreate .bin directory
Write-Host "Recreating node_modules\.bin..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "node_modules\.bin" | Out-Null

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:WATCHMAN_DISABLE = "1"
$env:CI = "true"
$env:EXPO_NO_TELEMETRY = "1"
$env:REACT_EDITOR = "none"

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Done! Now run one of these commands:" -ForegroundColor Green
Write-Host "  npm run android-windows" -ForegroundColor Cyan
Write-Host "  npm run android-safe" -ForegroundColor Cyan
Write-Host "  npx expo run:android --port 8085" -ForegroundColor Cyan