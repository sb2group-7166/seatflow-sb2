import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Students from "./pages/students/Students";
import AddStudentPage from "./pages/students/AddStudentPage";
import OldStudentsPage from "./pages/students/OldStudentsPage";
import StudentBookingPage from "./pages/students/StudentBookingPage";
import AddBookingPage from "./pages/students/AddBookingPage";
import EditBookingPage from "./pages/students/EditBookingPage";
import Seats from "./pages/seats/Seats";
import Shifts from "./pages/operations/Shifts";
import Payments from "./pages/financial/Payments";
import Notifications from "./pages/system/Notifications";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/system/Settings";
import DuePaymentsPage from "./pages/financial/DuePayments";
import CollectionsPage from "./pages/financial/Collections";
import ExpensesPage from "./pages/financial/Expenses";
import './App.css';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
