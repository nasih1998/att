import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Lecturers } from './pages/admin/Lecturers';
import { Lectures } from './pages/admin/Lectures';
import { AttendanceSheets } from './pages/admin/AttendanceSheets';
import { LecturerDashboard } from './pages/lecturer/Dashboard';
import { LectureSheets } from './pages/lecturer/LectureSheets';
import { AttendanceTable } from './pages/lecturer/AttendanceTable';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/admin' : '/lecturer'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lecturers"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Lecturers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lectures"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Lectures />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance-sheets"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AttendanceSheets />
          </ProtectedRoute>
        }
      />

      {/* Lecturer Routes */}
      <Route
        path="/lecturer"
        element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LecturerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer/lectures/:lectureId/sheets"
        element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LectureSheets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer/attendance/:sheetId"
        element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <AttendanceTable />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
