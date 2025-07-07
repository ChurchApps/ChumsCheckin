# Fix Windows file permission issues for Metro
Write-Host "Fixing Windows file permissions..." -ForegroundColor Green

# Kill all Node.js processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "expo" -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment for processes to fully stop
Start-Sleep -Seconds 2

# Clean up problematic temp files
Write-Host "Cleaning temporary files..." -ForegroundColor Yellow
$tempFiles = Get-ChildItem -Path "node_modules\.bin" -Filter ".*" -Force -ErrorAction SilentlyContinue
foreach ($file in $tempFiles) {
    try {
        Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
    } catch {
        # Ignore errors for files that can't be deleted
    }
}

# Clean Metro cache
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
}

npx expo export:clear

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "You can now run: npm run android-safe" -ForegroundColor Cyan