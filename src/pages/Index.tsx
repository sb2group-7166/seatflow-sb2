
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import StudentTable from "@/components/dashboard/StudentTable";
import { 
  Users, 
  BookOpen, 
  Bell, 
  Clock, 
  CalendarCheck, 
  Ban
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to SB2 Library Management System</p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Students" 
            value="2,945" 
            icon={Users} 
            trend={{ value: 12, isPositive: true }} 
            description="since last month" 
          />
          <StatCard 
            title="Available Seats" 
            value="78/240" 
            icon={BookOpen} 
            description="across all zones" 
          />
          <StatCard 
            title="Today's Bookings" 
            value="187" 
            icon={CalendarCheck}
            trend={{ value: 8, isPositive: true }} 
            description="compared to yesterday" 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-6">
            <StatCard 
              title="Current Shift" 
              value="Morning" 
              icon={Clock} 
              description="8:00 AM - 1:00 PM" 
            />
            <StatCard 
              title="Pending Notifications" 
              value="24" 
              icon={Bell} 
              description="requires attention" 
            />
            <StatCard 
              title="Blacklisted Students" 
              value="8" 
              icon={Ban} 
              description="due to violations" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OccupancyChart />
          <StudentTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
