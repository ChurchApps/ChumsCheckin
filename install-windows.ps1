# PowerShell installation script for Windows

Write-Host "Installing ChumsCheckin dependencies for Windows..." -ForegroundColor Green

# Clean existing installations
Write-Host "Cleaning existing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install with legacy peer deps
Write-Host "Installing dependencies with legacy peer deps..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Installation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. npm run android-windows" -ForegroundColor White
    Write-Host "2. Or: npm run android-safe" -ForegroundColor White
} else {
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "Try running manually: npm install --legacy-peer-deps --force" -ForegroundColor Yellow
}