# SSH Deployment Guide - Step by Step

Complete guide to deploy the Attendance Management System to Hostinger using SSH access.

---

## Prerequisites

Before starting, ensure you have:
- ✅ Hostinger shared hosting account with SSH access enabled
- ✅ Domain or subdomain configured
- ✅ SSH client installed (PuTTY for Windows or built-in terminal for Linux/Mac)
- ✅ Database credentials from Hostinger
- ✅ Your project ready locally at `d:\Atten`

---

## Part 1: Enable and Access SSH on Hostinger

### Step 1: Enable SSH Access

1. **Login to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Enter your credentials

2. **Navigate to SSH Access**
   - In hPanel, go to **Advanced** section
   - Click on **SSH Access**

3. **Enable SSH**
   - Toggle **SSH Access** to **ON**
   - You'll see your SSH credentials:
     ```
     Username: u123456789
     Host: yourdomain.com (or IP address)
     Port: 65002 (or 22, depends on Hostinger)
     ```
   - **Save these credentials!**

4. **Set/Reset SSH Password**
   - Click **Change SSH Password**
   - Set a strong password
   - **Remember this password!**

### Step 2: Connect via SSH

#### Option A: Using Windows PowerShell (Recommended for Windows)

1. **Open PowerShell**
   - Press `Win + X`
   - Select **Windows PowerShell** or **Terminal**

2. **Connect to Server**
   ```powershell
   ssh u123456789@yourdomain.com -p 65002
   ```
   
   Replace:
   - `u123456789` with your SSH username
   - `yourdomain.com` with your domain or IP
   - `65002` with your SSH port (might be 22)

3. **Accept Fingerprint**
   - First time: Type `yes` and press Enter
   - Enter your SSH password when prompted

4. **You're In!**
   - You should see a welcome message and command prompt like:
     ```
     u123456789@server:~$
     ```

#### Option B: Using PuTTY (Alternative for Windows)

1. **Download PuTTY**
   - Download from: https://www.putty.org/
   - Install it

2. **Configure Connection**
   - Open PuTTY
   - **Host Name**: `yourdomain.com`
   - **Port**: `65002` (or your SSH port)
   - **Connection Type**: SSH
   - Click **Open**

3. **Login**
   - Username: `u123456789`
   - Password: Your SSH password

---

## Part 2: Prepare Your Local Project

### Step 1: Build React Frontend

1. **Open PowerShell/Terminal**
   ```powershell
   cd d:\Atten\frontend
   ```

2. **Update API URL**
   
   Edit `src\api\axios.ts`:
   ```typescript
   const api = axios.create({
     baseURL: 'https://yourdomain.com/api',  // ⚠️ Update this!
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
     },
   });
   ```

3. **Install Dependencies (if needed)**
   ```powershell
   npm install
   ```

4. **Build for Production**
   ```powershell
   npm run build
   ```
   
   ✅ This creates a `dist` folder with optimized files

### Step 2: Prepare Laravel Backend

1. **Navigate to Backend**
   ```powershell
   cd d:\Atten\backend
   ```

2. **Create Production .env File**
   
   Create `d:\Atten\backend\.env.production`:
   ```env
   APP_NAME="Attendance System"
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_WILL_BE_GENERATED
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=u123456789_attendance
   DB_USERNAME=u123456789_user
   DB_PASSWORD=your_database_password

   SANCTUM_STATEFUL_DOMAINS=yourdomain.com
   SESSION_DRIVER=file
   QUEUE_CONNECTION=sync
   ```

3. **Clear All Caches**
   ```powershell
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   php artisan cache:clear
   ```

---

## Part 3: Setup Database on Hostinger

### Step 1: Create MySQL Database

1. **In Hostinger hPanel**
   - Go to **Databases** → **MySQL Databases**
   - Click **Create New Database**

2. **Fill Database Details**
   - **Database Name**: `attendance_db` (Hostinger will prefix it with your username)
   - **Username**: Create new user or use existing
   - **Password**: Set a strong password
   - Click **Create**

3. **Note Your Credentials**
   ```
   Database Name: u123456789_attendance_db
   Username: u123456789_dbuser
   Password: [your password]
   Host: localhost
   ```

### Step 2: Export Local Database

1. **Export Database Structure and Data**
   ```powershell
   cd d:\Atten\backend
   php artisan migrate:fresh --seed
   ```

2. **Create SQL Dump** (if you have MySQL installed locally)
   ```powershell
   # Using Laravel schema dump
   php artisan schema:dump
   
   # Or using mysqldump
   mysqldump -u root -p attendance_db > database_backup.sql
   ```

---

## Part 4: Upload Files via SSH

### Step 1: Upload Backend Files

#### Method 1: Using SCP (Secure Copy)

1. **Open NEW PowerShell Window** (keep SSH session open in another)

2. **Upload Backend Folder**
   ```powershell
   # Upload entire backend (this may take time)
   scp -P 65002 -r d:\Atten\backend u123456789@yourdomain.com:~/
   ```
   
   Replace:
   - `65002` with your SSH port
   - `u123456789` with your SSH username
   - `yourdomain.com` with your domain

3. **Upload .env.production separately**
   ```powershell
   scp -P 65002 d:\Atten\backend\.env.production u123456789@yourdomain.com:~/backend/.env
   ```

#### Method 2: Using Git (Recommended)

1. **In your SSH session**, navigate to home:
   ```bash
   cd ~
   ```

2. **Clone your repository** (if your code is on GitHub):
   ```bash
   git clone https://github.com/yourusername/attendance-system.git backend
   cd backend
   ```

3. **Or create backend folder manually**:
   ```bash
   mkdir -p backend
   cd backend
   ```

### Step 2: Upload Frontend Files

1. **Upload Frontend Build**
   ```powershell
   # From your local PowerShell
   scp -P 65002 -r d:\Atten\frontend\dist\* u123456789@yourdomain.com:~/public_html/
   ```

---

## Part 5: Configure Backend on Server

### Step 1: Move Backend to Correct Location

1. **In your SSH session**:
   ```bash
   # Navigate to home
   cd ~
   
   # Create api folder in public_html
   mkdir -p public_html/api
   
   # Move backend files to api folder
   mv backend/* public_html/api/
   mv backend/.* public_html/api/ 2>/dev/null || true
   
   # Navigate to api folder
   cd public_html/api
   ```

### Step 2: Install Composer Dependencies

1. **Check if Composer is available**:
   ```bash
   composer --version
   ```

2. **Install Dependencies**:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   ```
   
   ⏳ This may take 2-5 minutes

3. **If Composer is not available**, upload vendor folder:
   ```powershell
   # From local PowerShell
   cd d:\Atten\backend
   composer install --optimize-autoloader --no-dev
   
   # Then upload vendor folder
   scp -P 65002 -r vendor u123456789@yourdomain.com:~/public_html/api/
   ```

### Step 3: Configure Environment

1. **Edit .env file** (in SSH session):
   ```bash
   cd ~/public_html/api
   nano .env
   ```
   
   Or use vi:
   ```bash
   vi .env
   ```

2. **Update Database Credentials**:
   ```env
   DB_DATABASE=u123456789_attendance_db
   DB_USERNAME=u123456789_dbuser
   DB_PASSWORD=your_actual_password
   ```

3. **Save and Exit**:
   - For nano: Press `Ctrl + X`, then `Y`, then `Enter`
   - For vi: Press `Esc`, type `:wq`, press `Enter`

### Step 4: Generate Application Key

```bash
cd ~/public_html/api
php artisan key:generate
```

✅ This updates APP_KEY in your .env file

### Step 5: Set Permissions

```bash
cd ~/public_html/api
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

### Step 6: Run Migrations

```bash
cd ~/public_html/api
php artisan migrate --force
php artisan db:seed --force
```

✅ Your database is now set up!

### Step 7: Optimize Laravel

```bash
cd ~/public_html/api
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## Part 6: Configure Web Server

### Step 1: Create .htaccess for Laravel API

1. **Create main .htaccess**:
   ```bash
   cd ~/public_html/api
   nano .htaccess
   ```

2. **Add this content**:
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteRule ^(.*)$ public/$1 [L]
   </IfModule>
   ```

3. **Save and exit** (Ctrl + X, Y, Enter)

4. **Create public/.htaccess**:
   ```bash
   cd ~/public_html/api/public
   nano .htaccess
   ```

5. **Add this content**:
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

6. **Save and exit**

### Step 2: Create .htaccess for Frontend

1. **Navigate to public_html**:
   ```bash
   cd ~/public_html
   nano .htaccess
   ```

2. **Add this content**:
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

3. **Save and exit**

---

## Part 7: Verify Deployment

### Step 1: Check File Structure

```bash
cd ~/public_html
ls -la
```

You should see:
```
public_html/
├── api/              (Laravel backend)
├── assets/           (React assets)
├── index.html        (React entry)
└── .htaccess         (Frontend routing)
```

### Step 2: Test Backend API

1. **Test API endpoint**:
   ```bash
   curl https://yourdomain.com/api/login
   ```
   
   Expected response:
   ```json
   {"message":"The GET method is not supported for this route."}
   ```
   
   ✅ This is correct! Login requires POST

2. **Check Laravel logs**:
   ```bash
   tail -f ~/public_html/api/storage/logs/laravel.log
   ```
   
   Press `Ctrl + C` to exit

### Step 3: Test Frontend

1. **Open browser** and visit:
   ```
   https://yourdomain.com
   ```
   
   ✅ You should see the login page

2. **Test Login**:
   - Email: `admin@example.com`
   - Password: `password`
   
   ✅ Should successfully login

---

## Part 8: Common SSH Commands

### File Management

```bash
# List files
ls -la

# Navigate to directory
cd ~/public_html/api

# View file content
cat .env

# Edit file
nano filename.txt

# Copy file
cp source.txt destination.txt

# Move/Rename file
mv oldname.txt newname.txt

# Delete file
rm filename.txt

# Delete folder
rm -rf foldername

# Create directory
mkdir foldername

# Check disk space
df -h

# Check folder size
du -sh foldername
```

### Laravel Commands

```bash
# Navigate to Laravel
cd ~/public_html/api

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Run migrations
php artisan migrate --force

# Run seeders
php artisan db:seed --force

# Check Laravel version
php artisan --version

# View routes
php artisan route:list

# Generate key
php artisan key:generate
```

### File Permissions

```bash
# Set folder permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Set file permissions
chmod 644 .env

# Check permissions
ls -la
```

### View Logs

```bash
# View Laravel log (last 50 lines)
tail -n 50 ~/public_html/api/storage/logs/laravel.log

# Follow log in real-time
tail -f ~/public_html/api/storage/logs/laravel.log

# View error log
tail -n 50 ~/logs/error_log
```

---

## Part 9: Troubleshooting

### Issue 1: 500 Internal Server Error

**Diagnose**:
```bash
cd ~/public_html/api
tail -n 50 storage/logs/laravel.log
```

**Common Fixes**:
```bash
# Fix permissions
chmod -R 755 storage bootstrap/cache

# Clear and recache
php artisan config:clear
php artisan config:cache

# Check .env exists
ls -la .env

# Regenerate key
php artisan key:generate
```

### Issue 2: Database Connection Error

**Check**:
```bash
cd ~/public_html/api
cat .env | grep DB_
```

**Fix**:
```bash
nano .env
# Update DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Save and exit

php artisan config:clear
php artisan config:cache
```

### Issue 3: Composer Dependencies Missing

**Fix**:
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

### Issue 4: Routes Not Working

**Fix**:
```bash
# Check .htaccess exists
ls -la ~/public_html/api/.htaccess
ls -la ~/public_html/api/public/.htaccess

# Clear route cache
php artisan route:clear
php artisan route:cache
```

### Issue 5: Frontend Shows Blank Page

**Check**:
```bash
# Verify index.html exists
ls -la ~/public_html/index.html

# Check .htaccess
cat ~/public_html/.htaccess
```

**Fix**: Re-upload frontend build files

---

## Part 10: Update/Redeploy Process

### Update Backend Code

```bash
# SSH into server
ssh u123456789@yourdomain.com -p 65002

# Navigate to backend
cd ~/public_html/api

# If using Git
git pull origin main

# Or upload new files via SCP from local
# (in local PowerShell)
scp -P 65002 -r d:\Atten\backend\app u123456789@yourdomain.com:~/public_html/api/

# Back in SSH, clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run new migrations (if any)
php artisan migrate --force

# Recache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Update Frontend

```bash
# From local PowerShell
cd d:\Atten\frontend

# Rebuild
npm run build

# Upload new build
scp -P 65002 -r dist\* u123456789@yourdomain.com:~/public_html/
```

---

## Part 11: Security Best Practices

### 1. Secure .env File

```bash
cd ~/public_html/api
chmod 644 .env
```

### 2. Disable Directory Listing

Add to `.htaccess`:
```apache
Options -Indexes
```

### 3. Set Production Environment

In `.env`:
```env
APP_ENV=production
APP_DEBUG=false
```

### 4. Enable HTTPS

In Hostinger hPanel:
- Go to **SSL** section
- Enable **Free SSL Certificate**
- Force HTTPS redirect

### 5. Regular Backups

```bash
# Backup database
cd ~/public_html/api
php artisan db:backup

# Or manual backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

---

## Part 12: Useful Tips

### 1. Create Aliases

Add to `~/.bashrc`:
```bash
alias ll='ls -la'
alias art='php artisan'
alias cdc='cd ~/public_html/api'
```

Reload:
```bash
source ~/.bashrc
```

### 2. Monitor Disk Space

```bash
df -h
du -sh ~/public_html/*
```

### 3. Check PHP Version

```bash
php -v
```

### 4. View Running Processes

```bash
ps aux | grep php
```

### 5. Download Files from Server

```powershell
# From local PowerShell
scp -P 65002 u123456789@yourdomain.com:~/public_html/api/.env d:\Downloads\
```

---

## Quick Reference Card

### Connect to SSH
```bash
ssh u123456789@yourdomain.com -p 65002
```

### Navigate to Backend
```bash
cd ~/public_html/api
```

### Clear All Caches
```bash
php artisan config:clear && php artisan route:clear && php artisan view:clear
```

### Recache Everything
```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

### View Logs
```bash
tail -f ~/public_html/api/storage/logs/laravel.log
```

### Fix Permissions
```bash
chmod -R 755 storage bootstrap/cache && chmod 644 .env
```

### Run Migrations
```bash
php artisan migrate --force
```

---

## Support

If you encounter issues:

1. **Check Laravel logs**:
   ```bash
   tail -n 100 ~/public_html/api/storage/logs/laravel.log
   ```

2. **Check error logs**:
   ```bash
   tail -n 100 ~/logs/error_log
   ```

3. **Contact Hostinger Support**:
   - Live chat in hPanel
   - Email: support@hostinger.com

4. **Laravel Documentation**:
   - https://laravel.com/docs/deployment

---

## Final Checklist

- [ ] SSH access enabled and tested
- [ ] Database created and credentials saved
- [ ] Backend uploaded to `~/public_html/api/`
- [ ] Frontend uploaded to `~/public_html/`
- [ ] Composer dependencies installed
- [ ] .env configured with correct database credentials
- [ ] APP_KEY generated
- [ ] Permissions set (755 for storage, 644 for .env)
- [ ] Migrations run successfully
- [ ] Seeders run successfully
- [ ] .htaccess files created
- [ ] Laravel caches optimized
- [ ] API endpoint tested (returns expected error)
- [ ] Frontend loads in browser
- [ ] Login works successfully
- [ ] All CRUD operations tested
- [ ] Attendance marking tested
- [ ] APP_DEBUG=false in production
- [ ] SSL certificate enabled

---

**Congratulations! Your Attendance System is now deployed! 🎉**

For questions or issues, refer to the troubleshooting section or check the logs.
