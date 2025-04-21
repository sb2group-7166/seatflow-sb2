import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/dashboard/Dashboard';
import NewBookingPage from '@/pages/operations/booking/NewBookingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'bookings/new',
        element: <NewBookingPage />
      }
    ]
  }
]); 