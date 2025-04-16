import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ShiftSchedule from "@/components/dashboard/ShiftSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Settings } from "lucide-react";

const ShiftsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Shift Management</h1>
            <p className="text-muted-foreground">
              Manage library operating shifts
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Shift Schedule for {date?.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-muted/50 rounded-md">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <h4 className="font-medium">Morning Shift</h4>
                    <p className="text-sm text-muted-foreground">8:00 AM - 1:00 PM</p>
                  </div>
                  <div className="ml-auto">
                    <Button size="sm">Details</Button>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-muted/50 rounded-md">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <h4 className="font-medium">Afternoon Shift</h4>
                    <p className="text-sm text-muted-foreground">1:00 PM - 6:00 PM</p>
                  </div>
                  <div className="ml-auto">
                    <Button size="sm">Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ShiftSchedule />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShiftsPage;
