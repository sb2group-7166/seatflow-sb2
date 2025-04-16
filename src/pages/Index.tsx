import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sofa, IndianRupee, Calendar, Clock, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalSeats: 98,
    bookedSeats: 45,
    activeStudents: 120,
    todayRevenue: 2500,
    monthlyRevenue: 75000,
    averageOccupancy: '65%'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your library management system</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalSeats}</div>
                <Sofa className="h-6 w-6 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Library capacity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Booked Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.bookedSeats}</div>
                <Sofa className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Currently occupied</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.activeStudents}</div>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {stats.todayRevenue}
                </div>
                <Calendar className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Daily earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {stats.monthlyRevenue}
                </div>
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month's earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.averageOccupancy}</div>
                <Clock className="h-6 w-6 text-indigo-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Daily average</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
