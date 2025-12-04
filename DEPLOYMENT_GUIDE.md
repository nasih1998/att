# Deployment Guide - Hostinger Shared Hosting

Complete step-by-step guide to deploy the Attendance Management System to Hostinger shared hosting.

## Prerequisites

- Hostinger shared hosting account with:
  - PHP 8.1+ support
  - MySQL database access
  - SSH access (recommended) or File Manager
  - Domain or subdomain configured

## Part 1: Prepare Laravel Backend for Production

### Step 1: Optimize Laravel Project Locally

1. **Update .env for production** (create a new `.env.production` file):
   ```bash
   cd d:\Atten\backend
   ```

2. Create `.env.production` with these settings:
   ```env
   APP_NAME="Attendance System"
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_hostinger_db_name
   DB_USERNAME=your_hostinger_db_user
   DB_PASSWORD=your_hostinger_db_password

   SESSION_DRIVER=file
   QUEUE_CONNECTION=sync
   ```

3. **Install production dependencies**:
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

4. **Optimize Laravel**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

5. **Create a deployment package**:
   ```bash
   # Clear caches first
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

### Step 2: Build React Frontend for Production

1. **Update API URL in frontend**:
   
   Edit `d:\Atten\frontend\src\api\axios.ts`:
   ```typescript
   const api = axios.create({
     baseURL: 'https://yourdomain.com/api',  // Update this
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
     },
   });
   ```

2. **Build production bundle**:
   ```bash
   cd d:\Atten\frontend
   cmd /c npm run build
   ```
   
   This creates a `dist` folder with optimized files.

---

## Part 2: Setup Hostinger Database

### Step 1: Create MySQL Database

1. Login to **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Fill in:
   - Database name: `attendance_db` (or your preferred name)
   - Username: Create new user with strong password
   - Click **Create**
5. **Save these credentials** - you'll need them!

### Step 2: Import Database Structure

1. On your local machine, export the database structure:
   ```bash
   cd d:\Atten\backend
   php artisan schema:dump
   ```

2. Or create SQL dump manually:
   ```bash
   # If you have MySQL installed locally
   mysqldump -u root -p attendance_db > database_backup.sql
   ```

3. In Hostinger hPanel:
   - Go to **Databases** → **phpMyAdmin**
   - Select your database
   - Click **Import** tab
   - Choose your SQL file
   - Click **Go**

---

## Part 3: Upload Files to Hostinger

### Method A: Using File Manager (Easier)

1. **Prepare files locally**:
   ```bash
   # Create a zip of backend (excluding node_modules, vendor, .git)
   # Manually zip these folders:
   # - app/
   # - bootstrap/
   # - config/
   # - database/
   # - public/
   # - resources/
   # - routes/
   # - storage/
   # - .env.production (rename to .env after upload)
   # - artisan
   # - composer.json
   # - composer.lock
   ```

2. **Upload Backend**:
   - Login to Hostinger hPanel
   - Go to **File Manager**
   - Navigate to `public_html` (or your domain folder)
   - Create folder: `api` (this will be your backend)
   - Upload and extract Laravel files to `public_html/api/`
   - Rename `.env.production` to `.env`

3. **Upload Frontend**:
   - In File Manager, go to `public_html/`
   - Upload all files from `d:\Atten\frontend\dist\` to `public_html/`
   - Your structure should be:
     ```
     public_html/
     ├── api/              (Laravel backend)
     │   ├── app/
     │   ├── public/
     │   ├── .env
     │   └── ...
     ├── index.html        (React frontend)
     ├── assets/
     └── ...
     ```

### Method B: Using SSH (Advanced, Faster)

1. **Enable SSH** in Hostinger hPanel (if available)

2. **Connect via SSH**:
   ```bash
   ssh u123456789@yourdomain.com
   ```

3. **Upload using SCP or Git**:
   ```bash
   # From your local machine
   scp -r d:\Atten\backend u123456789@yourdomain.com:~/public_html/api/
   scp -r d:\Atten\frontend\dist/* u123456789@yourdomain.com:~/public_html/
   ```

---

## Part 4: Configure Laravel on Hostinger

### Step 1: Install Composer Dependencies

**Via SSH** (if available):
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

**Via File Manager** (if no SSH):
1. Download `vendor.zip` from your local project
2. Upload to `public_html/api/`
3. Extract it

### Step 2: Set Permissions

**Via SSH**:
```bash
cd ~/public_html/api
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

**Via File Manager**:
- Right-click `storage` folder → Permissions → Set to 755
- Right-click `bootstrap/cache` → Permissions → Set to 755

### Step 3: Configure .env File

1. Edit `public_html/api/.env`:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_DATABASE=u123456789_attendance  # Your Hostinger DB name
   DB_USERNAME=u123456789_user        # Your Hostinger DB user
   DB_PASSWORD=your_password_here     # Your Hostinger DB password
   ```

2. Generate APP_KEY:
   ```bash
   # Via SSH
   php artisan key:generate

   # Or manually: generate a random base64 string and add to .env
   ```

### Step 4: Run Migrations

**Via SSH**:
```bash
cd ~/public_html/api
php artisan migrate --force
php artisan db:seed --force
```

**Via phpMyAdmin** (if no SSH):
- Import the SQL file you created earlier

---

## Part 5: Configure Web Server

### Step 1: Create .htaccess for Laravel

Create `public_html/api/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Create `public_html/api/public/.htaccess`:
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

### Step 2: Configure Frontend Routing

Create `public_html/.htaccess`:
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

---

## Part 6: Update Frontend API URL

If you haven't already, update the API URL in your built frontend:

1. **Before building**, edit `frontend/src/api/axios.ts`:
   ```typescript
   const api = axios.create({
     baseURL: 'https://yourdomain.com/api',
     // ...
   });
   ```

2. **Rebuild**:
   ```bash
   cd d:\Atten\frontend
   cmd /c npm run build
   ```

3. **Re-upload** the `dist` folder contents to `public_html/`

---

## Part 7: Final Configuration

### Step 1: Optimize Laravel for Production

**Via SSH**:
```bash
cd ~/public_html/api
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Step 2: Test the Deployment

1. **Test Backend API**:
   - Visit: `https://yourdomain.com/api/login`
   - Should return: "The GET method is not supported for this route."
   - This is correct! (Login requires POST)

2. **Test Frontend**:
   - Visit: `https://yourdomain.com`
   - Should see the login page

3. **Test Login**:
   - Email: `admin@example.com`
   - Password: `password`
   - Should successfully login and redirect

### Step 3: Security Checklist

- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Remove `.env.example` from server
- [ ] Ensure `storage` and `bootstrap/cache` are writable (755)
- [ ] Verify `.htaccess` files are in place
- [ ] Test all CRUD operations
- [ ] Test attendance marking

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Solution**:
1. Check `.env` file exists and has correct database credentials
2. Check file permissions (755 for folders, 644 for files)
3. Check `storage/logs/laravel.log` for errors
4. Run: `php artisan config:clear`

### Issue: Database Connection Error

**Solution**:
1. Verify database credentials in `.env`
2. Ensure database exists in Hostinger
3. Check if database user has proper permissions
4. Try `DB_HOST=localhost` or the specific host from Hostinger

### Issue: 404 on API Routes

**Solution**:
1. Check `.htaccess` files are uploaded
2. Verify mod_rewrite is enabled (usually is on Hostinger)
3. Check that `public` folder is accessible

### Issue: React Router 404 on Refresh

**Solution**:
1. Ensure `.htaccess` in `public_html/` has the React Router rules
2. Verify all routes redirect to `index.html`

### Issue: CORS Errors

**Solution**:
1. Update `config/cors.php`:
   ```php
   'allowed_origins' => [env('FRONTEND_URL', 'https://yourdomain.com')],
   'supports_credentials' => true,
   ```
2. Add to `.env`:
   ```
   FRONTEND_URL=https://yourdomain.com
   ```

---

## Quick Deployment Checklist

- [ ] Build React frontend (`npm run build`)
- [ ] Update API URL in frontend
- [ ] Create Hostinger database
- [ ] Upload Laravel files to `public_html/api/`
- [ ] Upload React build files to `public_html/`
- [ ] Configure `.env` with database credentials
- [ ] Install composer dependencies
- [ ] Set file permissions (755 for storage)
- [ ] Run migrations (`php artisan migrate --force`)
- [ ] Run seeders (`php artisan db:seed --force`)
- [ ] Create `.htaccess` files
- [ ] Cache config (`php artisan config:cache`)
- [ ] Test login and functionality

---

## File Structure on Hostinger

```
public_html/
├── api/                          # Laravel Backend
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   │   ├── index.php
│   │   └── .htaccess
│   ├── routes/
│   ├── storage/
│   │   └── logs/
│   ├── vendor/
│   ├── .env
│   ├── .htaccess
│   ├── artisan
│   └── composer.json
│
├── assets/                       # React Frontend Assets
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html                    # React Frontend Entry
└── .htaccess                     # Frontend Routing
```

---

## Alternative: Using Subdomain

If you want to use a subdomain for the API (e.g., `api.yourdomain.com`):

1. **Create subdomain** in Hostinger hPanel
2. **Upload Laravel** to subdomain folder
3. **Update frontend** API URL to `https://api.yourdomain.com`
4. **Update CORS** in Laravel to allow main domain

---

## Support Resources

- **Hostinger Knowledge Base**: https://support.hostinger.com
- **Laravel Deployment Docs**: https://laravel.com/docs/deployment
- **Contact me** if you encounter specific errors with logs

---

## Post-Deployment

After successful deployment:

1. **Change default passwords** for admin and lecturers
2. **Add real students and lecturers**
3. **Create actual lectures**
4. **Test attendance marking thoroughly**
5. **Set up backups** (Hostinger usually has automatic backups)
6. **Monitor error logs** regularly

Good luck with your deployment! 🚀
