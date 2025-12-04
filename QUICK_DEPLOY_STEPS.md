# Quick Deployment Steps - auas.naspos.xyz

**You are currently connected via SSH in your domain folder.**

Follow these commands in order. Copy and paste each command one by one.

---

## Part 1: Prepare Server Directories

```bash
# Check where you are (should be in domain folder)
pwd

# Navigate to public_html
cd public_html

# Create api folder for Laravel backend
mkdir -p api

# Check structure
ls -la
```

---

## Part 2: Upload Files from Local Machine

**Open a NEW PowerShell/Terminal window on your LOCAL machine** (keep SSH session open in another window).

### Upload Backend

```powershell
# Upload backend files (replace SSH_USERNAME and SSH_PORT with your actual values)
scp -P 65002 -r d:\Atten\backend\* u123456789@auas.naspos.xyz:~/domains/auas.naspos.xyz/public_html/api/
```

**Note:** Replace:
- `65002` with your SSH port (might be 22)
- `u123456789` with your SSH username
- If prompted, enter your SSH password

### Upload Frontend

```powershell
# Upload frontend dist files
scp -P 65002 -r d:\Atten\frontend\dist\* u123456789@auas.naspos.xyz:~/domains/auas.naspos.xyz/public_html/
```

---

## Part 3: Configure Backend (Back in SSH Session)

### Step 1: Navigate to API folder

```bash
cd ~/domains/auas.naspos.xyz/public_html/api
```

### Step 2: Create .env file

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env file
nano .env
```

**Update these values in .env:**

```env
APP_NAME="Attendance System"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://auas.naspos.xyz

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SANCTUM_STATEFUL_DOMAINS=auas.naspos.xyz
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### Step 3: Generate Application Key

```bash
php artisan key:generate
```

### Step 4: Set Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

### Step 5: Install Composer Dependencies (if vendor folder wasn't uploaded)

```bash
# Check if vendor folder exists
ls -la vendor

# If vendor doesn't exist, install dependencies
composer install --optimize-autoloader --no-dev
```

### Step 6: Run Migrations and Seeders

```bash
php artisan migrate --force
php artisan db:seed --force
```

### Step 7: Optimize Laravel for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## Part 4: Create .htaccess Files

### Step 1: Create main .htaccess for API

```bash
cd ~/domains/auas.naspos.xyz/public_html/api
nano .htaccess
```

**Paste this content:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**Save:** `Ctrl + X`, `Y`, `Enter`

### Step 2: Create .htaccess in public folder

```bash
cd ~/domains/auas.naspos.xyz/public_html/api/public
nano .htaccess
```

**Paste this content:**

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

**Save:** `Ctrl + X`, `Y`, `Enter`

### Step 3: Create .htaccess for Frontend

```bash
cd ~/domains/auas.naspos.xyz/public_html
nano .htaccess
```

**Paste this content:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Don't rewrite API requests
    RewriteRule ^api/ - [L]

    # Rewrite everything else to index.html for React Router
    RewriteRule ^ index.html [L]
</IfModule>
```

**Save:** `Ctrl + X`, `Y`, `Enter`

---

## Part 5: Verify File Structure

```bash
cd ~/domains/auas.naspos.xyz/public_html
ls -la
```

**You should see:**
```
.htaccess
api/
assets/
index.html
vite.svg
```

```bash
cd api
ls -la
```

**You should see:**
```
.env
.htaccess
app/
artisan
bootstrap/
composer.json
config/
database/
public/
routes/
storage/
vendor/
```

---

## Part 6: Test Deployment

### Test 1: Check Backend API

```bash
curl https://auas.naspos.xyz/api/login
```

**Expected response:**
```json
{"message":"The GET method is not supported for this route."}
```

✅ This is correct! (Login requires POST)

### Test 2: Check Frontend

Open browser and visit:
```
https://auas.naspos.xyz
```

✅ You should see the login page

### Test 3: Test Login

**Default credentials:**
- Email: `admin@example.com`
- Password: `password`

✅ Should successfully login and redirect to dashboard

---

## Part 7: Check Logs (If Issues)

```bash
# View Laravel logs
tail -n 50 ~/domains/auas.naspos.xyz/public_html/api/storage/logs/laravel.log

# Follow logs in real-time
tail -f ~/domains/auas.naspos.xyz/public_html/api/storage/logs/laravel.log
```

Press `Ctrl + C` to stop following logs

---

## Part 8: Common Issues & Fixes

### Issue: 500 Internal Server Error

```bash
# Check permissions
cd ~/domains/auas.naspos.xyz/public_html/api
chmod -R 755 storage bootstrap/cache

# Clear and recache
php artisan config:clear
php artisan config:cache

# Check logs
tail -n 50 storage/logs/laravel.log
```

### Issue: Database Connection Error

```bash
# Edit .env and verify database credentials
nano .env

# After editing, clear config cache
php artisan config:clear
php artisan config:cache
```

### Issue: Routes Not Working

```bash
# Clear route cache
php artisan route:clear
php artisan route:cache

# Verify .htaccess files exist
ls -la ~/domains/auas.naspos.xyz/public_html/.htaccess
ls -la ~/domains/auas.naspos.xyz/public_html/api/.htaccess
ls -la ~/domains/auas.naspos.xyz/public_html/api/public/.htaccess
```

---

## Part 9: Final Checklist

- [ ] Backend uploaded to `~/domains/auas.naspos.xyz/public_html/api/`
- [ ] Frontend uploaded to `~/domains/auas.naspos.xyz/public_html/`
- [ ] `.env` file created and configured with database credentials
- [ ] `APP_KEY` generated
- [ ] Permissions set (755 for storage, 644 for .env)
- [ ] Migrations run successfully
- [ ] Seeders run successfully
- [ ] All 3 `.htaccess` files created
- [ ] Laravel caches optimized
- [ ] API endpoint tested (returns expected error)
- [ ] Frontend loads in browser
- [ ] Login works successfully

---

## Quick Reference Commands

### Navigate to Backend
```bash
cd ~/domains/auas.naspos.xyz/public_html/api
```

### Navigate to Frontend
```bash
cd ~/domains/auas.naspos.xyz/public_html
```

### Clear All Caches
```bash
cd ~/domains/auas.naspos.xyz/public_html/api
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Recache Everything
```bash
cd ~/domains/auas.naspos.xyz/public_html/api
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### View Logs
```bash
tail -f ~/domains/auas.naspos.xyz/public_html/api/storage/logs/laravel.log
```

### Fix Permissions
```bash
cd ~/domains/auas.naspos.xyz/public_html/api
chmod -R 755 storage bootstrap/cache
chmod 644 .env
```

---

## Database Information You'll Need

Before starting, make sure you have:

1. **Database Name:** (from Hostinger hPanel)
2. **Database Username:** (from Hostinger hPanel)
3. **Database Password:** (from Hostinger hPanel)
4. **Database Host:** Usually `localhost`

Create the database in Hostinger hPanel if you haven't already:
1. Go to **Databases** → **MySQL Databases**
2. Click **Create New Database**
3. Save the credentials

---

## 🎉 Deployment Complete!

Once all steps are done and tests pass, your Attendance Management System is live at:

**Frontend:** https://auas.naspos.xyz
**Backend API:** https://auas.naspos.xyz/api

**Default Admin Login:**
- Email: `admin@example.com`
- Password: `password`

**⚠️ Important:** Change the default admin password after first login!

---

## Need Help?

If you encounter any errors:
1. Check the Laravel logs: `tail -n 50 ~/domains/auas.naspos.xyz/public_html/api/storage/logs/laravel.log`
2. Verify `.env` database credentials
3. Ensure all `.htaccess` files are in place
4. Check file permissions

Good luck! 🚀
