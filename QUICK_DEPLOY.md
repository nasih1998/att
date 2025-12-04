# 🚀 Quick Deployment Guide - Hostinger

## ⚡ Fast Track (30 minutes)

### 📋 What You Need
- [ ] Hostinger account with active hosting
- [ ] Domain name configured
- [ ] FTP client (FileZilla) or use Hostinger File Manager
- [ ] Your project files ready

---

## 🎯 Step-by-Step Deployment

### 1️⃣ Prepare Your Files (5 min)

**Option A: Use the automated script**
```powershell
cd d:\Atten
.\prepare-deployment.ps1
```
Enter your domain when prompted (e.g., `mysite.com`)

**Option B: Manual preparation**
```bash
# Build frontend
cd d:\Atten\frontend
# Update src/api/axios.ts with your domain first!
npm run build

# Clear Laravel caches
cd d:\Atten\backend
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

### 2️⃣ Setup Database in Hostinger (3 min)

1. Login to **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Note down:
   - Database name: `u123456_attendance`
   - Username: `u123456_user`
   - Password: `your_password`

---

### 3️⃣ Upload Files (10 min)

**Using File Manager:**

1. Go to **hPanel** → **File Manager**
2. Navigate to `public_html`

**Upload Backend:**
- Create folder: `api`
- Upload all Laravel files to `public_html/api/`
- **Important files to upload:**
  - `app/` folder
  - `bootstrap/` folder
  - `config/` folder
  - `database/` folder
  - `public/` folder
  - `routes/` folder
  - `storage/` folder (create if missing)
  - `vendor/` folder (or install via composer later)
  - `.env.production` (rename to `.env` after upload)
  - `artisan`
  - `composer.json`

**Upload Frontend:**
- Upload contents of `frontend/dist/` to `public_html/`
- Should have: `index.html`, `assets/` folder

---

### 4️⃣ Configure Backend (5 min)

**Edit `.env` file in `public_html/api/`:**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=u123456_attendance    # Your database name
DB_USERNAME=u123456_user          # Your database user
DB_PASSWORD=your_password         # Your database password
```

**Set Permissions:**
- Right-click `storage` → Permissions → `755`
- Right-click `bootstrap/cache` → Permissions → `755`

---

### 5️⃣ Setup Database (3 min)

**Option A: Via SSH (if available)**
```bash
cd ~/public_html/api
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
```

**Option B: Via phpMyAdmin**
1. Go to **hPanel** → **Databases** → **phpMyAdmin**
2. Select your database
3. Click **Import**
4. Upload your SQL file (export from local MySQL first)

---

### 6️⃣ Create .htaccess Files (2 min)

**File 1: `public_html/api/.htaccess`**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**File 2: `public_html/api/public/.htaccess`**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

**File 3: `public_html/.htaccess`**
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

---

### 7️⃣ Optimize Laravel (2 min)

**Via SSH:**
```bash
cd ~/public_html/api
php artisan config:cache
php artisan route:cache
php artisan optimize
```

**Via File Manager:**
- If no SSH, skip this (will work without optimization)

---

### 8️⃣ Test Your Site! (2 min)

1. Visit: `https://yourdomain.com`
2. Should see login page
3. Login with:
   - Email: `admin@example.com`
   - Password: `password`
4. Test creating a student
5. Test marking attendance

---

## ✅ Final Checklist

- [ ] Frontend loads at `https://yourdomain.com`
- [ ] Can login successfully
- [ ] Admin dashboard shows
- [ ] Can create/edit/delete students
- [ ] Lecturer can see their lectures
- [ ] Attendance marking works
- [ ] Checkboxes work correctly (mutual exclusion)
- [ ] Save attendance works

---

## 🔧 Common Issues & Quick Fixes

### ❌ 500 Error
```bash
# Check .env file exists and has correct DB credentials
# Check storage permissions (755)
# Check APP_KEY is set in .env
```

### ❌ Database Connection Error
```env
# In .env, try:
DB_HOST=localhost
# Or get exact host from Hostinger database panel
```

### ❌ API 404 Errors
```apache
# Make sure .htaccess files are uploaded
# Check mod_rewrite is enabled (usually is)
```

### ❌ Blank Page
```bash
# Enable debug temporarily:
APP_DEBUG=true
# Check error, then set back to false
```

---

## 📁 Final File Structure

```
public_html/
├── api/                    ← Laravel Backend
│   ├── app/
│   ├── public/
│   │   ├── index.php
│   │   └── .htaccess
│   ├── storage/           (755 permissions)
│   ├── .env
│   └── .htaccess
│
├── assets/                 ← React Assets
│   └── index-xxx.js
├── index.html             ← React Entry
└── .htaccess              ← Frontend Routing
```

---

## 🎓 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Lecturer | john@example.com | password |

**⚠️ Change these passwords after first login!**

---

## 📞 Need Help?

1. Check `storage/logs/laravel.log` for errors
2. Enable `APP_DEBUG=true` temporarily to see errors
3. Check Hostinger support docs
4. Review full guide: `DEPLOYMENT_GUIDE.md`

---

## 🎉 You're Done!

Your attendance system is now live at:
- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api

Start using it by:
1. Changing default passwords
2. Adding real students
3. Creating actual lectures
4. Marking attendance!

---

**Deployment Time: ~30 minutes** ⏱️
