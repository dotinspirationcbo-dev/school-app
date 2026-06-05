# Sanity check for Expo assets
Write-Host "=== Checking Expo Assets ===" -ForegroundColor Green

$requiredAssets = @(
  "./assets/images/logo.png",
  "./assets/images/android-icon-background.png",
  "./assets/images/android-icon-monochrome.png",
  "./assets/images/favicon.png"
)

$allFound = $true

foreach ($asset in $requiredAssets) {
  $fullPath = (Get-Item -Path $asset -ErrorAction SilentlyContinue)
  
  if ($fullPath) {
    Write-Host "✓ Found: $asset" -ForegroundColor Green
  } else {
    Write-Host "✗ Missing: $asset" -ForegroundColor Red
    $allFound = $false
  }
}

if ($allFound) {
  Write-Host "`n✅ All required assets are present!" -ForegroundColor Green
} else {
  Write-Host "`n❌ Some assets are missing!" -ForegroundColor Red
  exit 1
}
