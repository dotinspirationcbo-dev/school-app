import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import PrivateRoute from '../auth/PrivateRoute';

import StudentDashboard from '../dashboards/StudentDashboard';
import TeacherDashboard from '../dashboards/TeacherDashboard';
import AdminDashboard from '../dashboards/AdminDashboard';

import Students from '../modules/Students';
import Attendance from '../modules/Attendance';
import Marks from '../modules/Marks';

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute user={user}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <PrivateRoute user={user}>
            <Marks />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <PrivateRoute user={user}>
            <Attendance />
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <PrivateRoute user={user}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <PrivateRoute user={user}>
            <Students />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <PrivateRoute user={user}>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/marks"
        element={
          <PrivateRoute user={user}>
            <Marks />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute user={user}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <PrivateRoute user={user}>
            <Students />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <PrivateRoute user={user}>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/marks"
        element={
          <PrivateRoute user={user}>
            <Marks />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
