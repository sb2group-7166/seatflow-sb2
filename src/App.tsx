import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Students from "./pages/students/Students";
import AddStudentPage from "./pages/students/AddStudentPage";
import OldStudentsPage from "./pages/students/OldStudentsPage";
import StudentBookingPage from "./pages/students/StudentBookingPage";
import AddBookingPage from "./pages/students/AddBookingPage";
import EditBookingPage from "./pages/students/EditBookingPage";
import StudentProfile from "./pages/students/StudentProfile";
import Seats from "./pages/seats/Seats";
import Shifts from "./pages/operations/Shifts";
import Payments from "./pages/financial/Payments";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/system/Settings";
import DuePaymentsPage from "./pages/financial/DuePayments";
import CollectionsPage from "./pages/financial/Collections";
import ExpensesPage from "./pages/financial/Expenses";
import { ProfilePage } from "./pages/admin/ProfilePage";
import { SecurityPage } from "./pages/admin/SecurityPage";
import { AccessControlPage } from "./pages/admin/AccessControlPage";
import { TeamPage } from "./pages/admin/TeamPage";
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import PropertiesPage from './pages/properties/Properties';
import PropertyDetails from './pages/properties/PropertyDetails';
import BankAccountsPage from './pages/financial/BankAccounts';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/students/add" element={<AddStudentPage />} />
        <Route path="/students/old" element={<OldStudentsPage />} />
        <Route path="/students/booking" element={<StudentBookingPage />} />
        <Route path="/students/booking/add" element={<AddBookingPage />} />
        <Route path="/students/booking/edit/:id" element={<EditBookingPage />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/due-payments" element={<DuePaymentsPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/bank-accounts" element={<BankAccountsPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        {/* Admin Routes */}
        <Route path="/admin/profile" element={<ProfilePage />} />
        <Route path="/admin/security" element={<SecurityPage />} />
        <Route path="/admin/access-control" element={<AccessControlPage />} />
        <Route path="/admin/team" element={<TeamPage />} />
        {/* Property Routes */}
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        {/* Attendance Routes */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:studentId" element={<AttendancePage />} />
        <Route path="/attendance/reports" element={<AttendancePage />} />
        <Route path="/attendance/settings" element={<AttendancePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
