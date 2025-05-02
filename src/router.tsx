import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/dashboard';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import AttendancePage from './pages/AttendancePage';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
      {
    path: '/login',
    element: <LoginPage />,
      },
      {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/attendance',
    element: (
      <ProtectedRoute>
        <AttendancePage />
      </ProtectedRoute>
    ),
  },
]); 