
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import Seats from "./pages/Seats";
import Shifts from "./pages/Shifts";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import './App.css';
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/students" element={<Students />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
