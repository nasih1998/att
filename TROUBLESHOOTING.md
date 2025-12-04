# 🔧 Hostinger Deployment - Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Internal Server Error

**Symptoms:**
- White page with "500 Internal Server Error"
- Site doesn't load at all

**Solutions:**

**A. Check .env file**
```bash
# Make sure .env exists in public_html/api/
# Verify it has:
APP_KEY=base64:xxxxx  # Must be set!
DB_DATABASE=correct_name
DB_USERNAME=correct_user
DB_PASSWORD=correct_password
```

**B. Generate APP_KEY**
```bash
# Via SSH:
cd ~/public_html/api
php artisan key:generate

# Or manually add to .env:
APP_KEY=base64:your_generated_key_here
```

**C. Check file permissions**
```bash
# Via SSH:
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Via File Manager:
# Right-click folders → Permissions → 755
```

**D. Check Laravel logs**
```bash
# Look at: public_html/api/storage/logs/laravel.log
# This will show the exact error
```

---

### 2. Database Connection Failed

**Symptoms:**
- Error: "SQLSTATE[HY000] [1045] Access denied"
- Error: "Database connection failed"

**Solutions:**

**A. Verify database credentials**
```bash
# In Hostinger hPanel → Databases
# Copy EXACT credentials to .env:
DB_HOST=localhost          # Usually localhost
DB_DATABASE=u123456_dbname # Exact database name
DB_USERNAME=u123456_user   # Exact username
DB_PASSWORD=your_password  # Exact password
```

**B. Check database exists**
- Login to phpMyAdmin
- Verify database is created
- Verify user has permissions

**C. Try different DB_HOST**
```env
# Try these in order:
DB_HOST=localhost
DB_HOST=127.0.0.1
DB_HOST=mysql.hostinger.com  # Check Hostinger docs
```

---

### 3. API Routes Return 404

**Symptoms:**
- Frontend loads but API calls fail
- `/api/login` returns 404
- Network tab shows 404 errors

**Solutions:**

**A. Check .htaccess files exist**
```apache
# File: public_html/api/.htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# File: public_html/api/public/.htaccess
# (Full content in DEPLOYMENT_GUIDE.md)
```

**B. Verify file structure**
```
public_html/
├── api/
│   ├── public/
│   │   ├── index.php  ← Must exist!
│   │   └── .htaccess  ← Must exist!
│   └── .htaccess      ← Must exist!
```

**C. Clear route cache**
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

---

### 4. CORS Errors

**Symptoms:**
- Console error: "CORS policy blocked"
- API calls fail with CORS error
- Network tab shows CORS headers missing

**Solutions:**

**A. Update config/cors.php**
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://yourdomain.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**B. Add headers to .htaccess**
```apache
# In public_html/api/public/.htaccess, add:
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://yourdomain.com"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

---

### 5. Frontend Shows Blank Page

**Symptoms:**
- White/blank page
- No errors in console
- index.html loads but nothing renders

**Solutions:**

**A. Check API URL**
```typescript
// In src/api/axios.ts, verify:
baseURL: 'https://yourdomain.com/api',  // NOT localhost!
```

**B. Rebuild frontend**
```bash
cd d:\Atten\frontend
# Fix API URL first!
npm run build
# Re-upload dist/ contents
```

**C. Check browser console**
- Press F12
- Look for JavaScript errors
- Check Network tab for failed requests

---

### 6. Login Fails / Token Issues

**Symptoms:**
- Login button does nothing
- Error: "Unauthenticated"
- Redirects to login after successful login

**Solutions:**

**A. Check Sanctum configuration**
```env
# In .env:
SESSION_DRIVER=file
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

**B. Verify API endpoint**
```bash
# Test manually:
curl -X POST https://yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Should return: {"user":{...},"token":"..."}
```

**C. Check browser localStorage**
- F12 → Application → Local Storage
- Verify token is being saved
- Clear storage and try again

---

### 7. Vendor Folder Missing

**Symptoms:**
- Error: "Class not found"
- Error: "Vendor autoload not found"

**Solutions:**

**A. Install via SSH**
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

**B. Upload vendor folder**
```bash
# On local machine:
cd d:\Atten\backend
composer install --no-dev

# Zip vendor folder
# Upload to server
# Extract in public_html/api/
```

---

### 8. Migrations Won't Run

**Symptoms:**
- Error: "Migration table not found"
- Error: "SQLSTATE[42S02]: Table not found"

**Solutions:**

**A. Run migrations via SSH**
```bash
cd ~/public_html/api
php artisan migrate:fresh --force
php artisan db:seed --force
```

**B. Import SQL manually**
```bash
# Export from local:
mysqldump -u root -p attendance_db > backup.sql

# Import via phpMyAdmin:
# Databases → phpMyAdmin → Import → Choose file
```

**C. Check database permissions**
```bash
# User must have:
# - SELECT, INSERT, UPDATE, DELETE
# - CREATE, ALTER, DROP (for migrations)
```

---

### 9. React Router 404 on Refresh

**Symptoms:**
- Direct URL navigation shows 404
- Refresh on any page except home shows 404
- Works when navigating from home

**Solutions:**

**A. Add .htaccess to public_html/**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    RewriteRule ^api/ - [L]
    RewriteRule ^ index.html [L]
</IfModule>
```

**B. Verify .htaccess is uploaded**
- Check in File Manager
- Ensure it's not hidden
- Rename from .htaccess.txt if needed

---

### 10. File Upload Errors

**Symptoms:**
- Can't upload files via File Manager
- Files disappear after upload
- Permission denied errors

**Solutions:**

**A. Check file size limits**
```bash
# In Hostinger, check:
# hPanel → Advanced → PHP Configuration
# upload_max_filesize = 64M
# post_max_size = 64M
```

**B. Use FTP instead**
```bash
# Download FileZilla
# Connect with Hostinger FTP credentials
# Upload files directly
```

**C. Compress before upload**
```bash
# Zip large folders
# Upload zip file
# Extract via File Manager
```

---

## 🔍 Debugging Checklist

When something goes wrong, check in this order:

1. **Check Laravel logs**
   - `storage/logs/laravel.log`
   - Shows exact PHP errors

2. **Check browser console**
   - F12 → Console tab
   - Shows JavaScript errors

3. **Check network requests**
   - F12 → Network tab
   - See which API calls are failing

4. **Enable debug mode temporarily**
   ```env
   APP_DEBUG=true
   ```
   - See detailed errors
   - **Remember to disable after!**

5. **Check file permissions**
   ```bash
   storage/        → 755
   bootstrap/cache → 755
   .env            → 644
   ```

6. **Verify .htaccess files**
   - All 3 files must exist
   - Check for typos
   - Ensure proper formatting

7. **Test API directly**
   ```bash
   # Visit in browser:
   https://yourdomain.com/api/login
   # Should show: "Method not allowed" (correct!)
   ```

---

## 📞 Getting Help

### 1. Check Laravel Logs
```bash
# Location: public_html/api/storage/logs/laravel.log
# Download and read the last few lines
```

### 2. Enable Debug Mode
```env
# In .env:
APP_DEBUG=true
APP_ENV=local
# Visit site, see error
# DISABLE after debugging!
```

### 3. Contact Hostinger Support
- Live chat available 24/7
- Provide them with:
  - Error message
  - What you're trying to do
  - Laravel log excerpt

### 4. Common Hostinger Docs
- PHP Configuration: https://support.hostinger.com/en/articles/1583334
- Database Setup: https://support.hostinger.com/en/articles/1583228
- File Manager: https://support.hostinger.com/en/articles/1583257

---

## ✅ Health Check Commands

Run these to verify everything is working:

```bash
# Via SSH:
cd ~/public_html/api

# Check PHP version (should be 8.1+)
php -v

# Check Laravel installation
php artisan --version

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Check routes
php artisan route:list

# Clear all caches
php artisan optimize:clear

# Recache everything
php artisan optimize
```

---

## 🎯 Quick Fixes

### Reset Everything
```bash
# Via SSH:
cd ~/public_html/api
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear
php artisan optimize
```

### Fresh Database
```bash
php artisan migrate:fresh --force
php artisan db:seed --force
```

### Regenerate Key
```bash
php artisan key:generate
```

### Fix Permissions
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

---

## 🚨 Emergency Recovery

If everything breaks:

1. **Backup current files**
   - Download via File Manager
   - Save database via phpMyAdmin export

2. **Start fresh**
   - Delete all files in public_html
   - Re-upload from deployment package
   - Restore database

3. **Verify basics**
   - .env file exists and correct
   - Database credentials work
   - File permissions correct
   - .htaccess files in place

4. **Test step by step**
   - Can you see index.html?
   - Can you access /api/login?
   - Can you login?
   - Can you see dashboard?

---

Remember: Most issues are either:
- Wrong database credentials
- Missing .htaccess files
- Wrong file permissions
- Wrong API URL in frontend

Check these first! 🎯
