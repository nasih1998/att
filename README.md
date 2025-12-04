# Attendance Management System

A full-stack attendance management system built with Laravel 11 (backend) and React + TypeScript (frontend).

## Features

### Backend (Laravel 11)
- **Authentication**: Laravel Sanctum token-based authentication
- **User Roles**: Admin and Lecturer
- **Models**: User, Student, Lecture, AttendanceSheet, AttendanceRecord
- **API Endpoints**: RESTful API for all CRUD operations
- **Role-based Access Control**: Middleware protection for admin and lecturer routes

### Frontend (React + Vite + TypeScript)
- **Admin Dashboard**: Manage students, lecturers, lectures, and attendance sheets
- **Lecturer Dashboard**: View assigned lectures and mark attendance
- **Attendance Table**: Interactive checkbox interface with:
  - Mutual exclusion (only one status per student)
  - Bulk selection (Select ALL in class / not in class)
  - Auto-save functionality

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd d:\Atten\backend
   ```

2. Configure database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=attendance_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

3. Create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE attendance_db;
   exit;
   ```

4. Run migrations and seeders:
   ```bash
   php artisan migrate:fresh --seed
   ```

5. Start Laravel server:
   ```bash
   php artisan serve
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd d:\Atten\frontend
   ```

2. Start development server:
   ```bash
   cmd /c npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Demo Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `password`

### Lecturer Account
- Email: `john@example.com`
- Password: `password`

## Usage

### Admin Workflow
1. Login with admin credentials
2. Navigate to Students to add/edit/delete students
3. Navigate to Lecturers to manage lecturer accounts
4. Navigate to Lectures to create lectures and assign lecturers
5. Navigate to Attendance Sheets to create sheets for specific weeks

### Lecturer Workflow
1. Login with lecturer credentials
2. View "My Lectures" on the dashboard
3. Click on a lecture to see attendance sheets
4. Click "Mark Attendance" to open the attendance table
5. Use checkboxes to mark students as "In Class" or "Not In Class"
6. Use bulk selection buttons to mark all students at once
7. Click "Save Attendance" to submit

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Admin Routes (ADMIN role required)
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- Similar endpoints for lecturers and lectures
- `POST /api/attendance-sheets` - Create attendance sheet

### Attendance Routes (ADMIN or LECTURER role)
- `GET /api/lectures/{id}/sheets` - Get sheets for lecture
- `GET /api/attendance-sheets/{id}/records` - Get attendance records
- `POST /api/attendance-sheets/{id}/records` - Save attendance

## Technology Stack

### Backend
- Laravel 11
- MySQL
- Laravel Sanctum (API authentication)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios

## Project Structure

```
d:\Atten\
├── backend\              # Laravel 11 API
│   ├── app\
│   │   ├── Http\
│   │   │   ├── Controllers\Api\
│   │   │   └── Middleware\
│   │   └── Models\
│   ├── database\
│   │   ├── migrations\
│   │   └── seeders\
│   └── routes\
│       └── api.php
│
└── frontend\             # React + TypeScript
    ├── src\
    │   ├── api\          # API functions
    │   ├── components\   # Reusable components
    │   ├── contexts\     # React contexts
    │   ├── pages\        # Page components
    │   │   ├── admin\
    │   │   └── lecturer\
    │   └── types\        # TypeScript types
    └── package.json
```

## Notes

- Make sure MySQL is running before starting the backend
- The backend must be running on port 8000 for the frontend to connect
- CORS is configured to allow all origins in development
- All passwords in the seeder are hashed with bcrypt
