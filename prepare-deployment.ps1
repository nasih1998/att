# Deployment Preparation Script for Windows
# Run this before uploading to Hostinger

Write-Host "=== Attendance System - Deployment Preparation ===" -ForegroundColor Green
Write-Host ""

# Step 1: Build Frontend
Write-Host "Step 1: Building React Frontend..." -ForegroundColor Yellow
Set-Location "d:\Atten\frontend"

# Prompt for domain
$domain = Read-Host "Enter your domain (e.g., yourdomain.com)"
Write-Host "Updating API URL to: https://$domain/api" -ForegroundColor Cyan

# Update axios.ts with production URL
$axiosPath = "src\api\axios.ts"
$axiosContent = Get-Content $axiosPath -Raw
$axiosContent = $axiosContent -replace "baseURL: 'http://localhost:8000/api'", "baseURL: 'https://$domain/api'"
Set-Content $axiosPath $axiosContent

Write-Host "Building production bundle..." -ForegroundColor Cyan
cmd /c npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Prepare Backend
Write-Host ""
Write-Host "Step 2: Preparing Laravel Backend..." -ForegroundColor Yellow
Set-Location "d:\Atten\backend"

# Clear all caches
Write-Host "Clearing Laravel caches..." -ForegroundColor Cyan
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Create production .env template
Write-Host "Creating .env.production template..." -ForegroundColor Cyan
$envProduction = @"
APP_NAME="Attendance System"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://$domain

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_hostinger_db_name
DB_USERNAME=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file

LOG_CHANNEL=stack
LOG_LEVEL=error
"@

Set-Content ".env.production" $envProduction

Write-Host "✓ Backend prepared!" -ForegroundColor Green

# Step 3: Create deployment folders
Write-Host ""
Write-Host "Step 3: Creating deployment package..." -ForegroundColor Yellow
Set-Location "d:\Atten"

$deployPath = "d:\Atten\deployment"
if (Test-Path $deployPath) {
    Remove-Item $deployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deployPath | Out-Null
New-Item -ItemType Directory -Path "$deployPath\backend" | Out-Null
New-Item -ItemType Directory -Path "$deployPath\frontend" | Out-Null

# Copy backend files (excluding unnecessary files)
Write-Host "Copying backend files..." -ForegroundColor Cyan
$backendExclude = @('node_modules', 'vendor', '.git', 'storage\logs\*', 'tests')
Copy-Item "backend\*" "$deployPath\backend\" -Recurse -Exclude $backendExclude

# Copy frontend build
Write-Host "Copying frontend build..." -ForegroundColor Cyan
Copy-Item "frontend\dist\*" "$deployPath\frontend\" -Recurse

Write-Host "✓ Deployment package created at: $deployPath" -ForegroundColor Green

# Step 4: Create instructions file
Write-Host ""
Write-Host "Step 4: Creating upload instructions..." -ForegroundColor Yellow

$instructions = @"
=== UPLOAD INSTRUCTIONS ===

1. BACKEND (Laravel):
   - Upload contents of: $deployPath\backend\
   - To Hostinger path: public_html/api/
   - Rename .env.production to .env
   - Update database credentials in .env

2. FRONTEND (React):
   - Upload contents of: $deployPath\frontend\
   - To Hostinger path: public_html/
   
3. AFTER UPLOAD:
   - Set permissions: storage/ and bootstrap/cache/ to 755
   - Run: php artisan key:generate
   - Run: php artisan migrate --force
   - Run: php artisan db:seed --force
   - Run: php artisan config:cache
   
4. CREATE .htaccess FILES:
   See DEPLOYMENT_GUIDE.md for .htaccess content

Your domain: https://$domain
API endpoint: https://$domain/api

Demo credentials:
- Admin: admin@example.com / password
- Lecturer: john@example.com / password
"@

Set-Content "$deployPath\UPLOAD_INSTRUCTIONS.txt" $instructions

Write-Host "✓ Instructions created!" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "=== DEPLOYMENT READY ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Compress the 'deployment' folder or upload via FTP" -ForegroundColor White
Write-Host "2. Follow instructions in: $deployPath\UPLOAD_INSTRUCTIONS.txt" -ForegroundColor White
Write-Host "3. See DEPLOYMENT_GUIDE.md for detailed steps" -ForegroundColor White
Write-Host ""
Write-Host "Deployment folder: $deployPath" -ForegroundColor Cyan
Write-Host ""
