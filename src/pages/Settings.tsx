import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { SeatZone } from "@/types";
import { Armchair, BookOpen, CalendarDays, Clock, Layout, MapPin, Settings as SettingsIcon, Sofa, Users, Bell } from "lucide-react";

const seatLayoutSchema = z.object({
  seatingMode: z.string(),
  rowSpacing: z.string(),
  seatSpacing: z.string(),
  autoNumbering: z.boolean().default(true),
  enableGroupBooking: z.boolean().default(true),
  defaultLayout: z.string(),
});

const seatingFeaturesSchema = z.object({
  allowMultiDayBooking: z.boolean().default(true),
  maxHoursPerBooking: z.string(),
  requireApproval: z.boolean().default(false),
  allowStudentCancellation: z.boolean().default(true),
  enableWaitlist: z.boolean().default(true),
  preventDoubleBooking: z.boolean().default(true),
  requireStudentVerification: z.boolean().default(false)
});

const reservationRulesSchema = z.object({
  maxDaysInAdvance: z.string(),
  maxActiveReservations: z.string(),
  bookingCooldown: z.string(),
  lateArrivalPolicy: z.string(),
  noShowPenalty: z.string(),
});

const SettingsPage = () => {
  const { toast } = useToast();

  const seatingLayoutForm = useForm<z.infer<typeof seatLayoutSchema>>({
    resolver: zodResolver(seatLayoutSchema),
    defaultValues: {
      seatingMode: "standard",
      rowSpacing: "normal",
      seatSpacing: "normal",
      autoNumbering: true,
      enableGroupBooking: true,
      defaultLayout: "classroom"
    },
  });

  const seatingFeaturesForm = useForm<z.infer<typeof seatingFeaturesSchema>>({
    resolver: zodResolver(seatingFeaturesSchema),
    defaultValues: {
      allowMultiDayBooking: true,
      maxHoursPerBooking: "4",
      requireApproval: false,
      allowStudentCancellation: true,
      enableWaitlist: true,
      preventDoubleBooking: true,
      requireStudentVerification: false
    },
  });

  const reservationRulesForm = useForm<z.infer<typeof reservationRulesSchema>>({
    resolver: zodResolver(reservationRulesSchema),
    defaultValues: {
      maxDaysInAdvance: "7",
      maxActiveReservations: "2",
      bookingCooldown: "1",
      lateArrivalPolicy: "15",
      noShowPenalty: "1",
    },
  });

  const onSubmitSeatingLayout = (data: z.infer<typeof seatLayoutSchema>) => {
    toast({
      title: "Seating Layout Updated",
      description: "Your seating layout settings have been updated successfully.",
    });
    console.log("Seating Layout:", data);
  };

  const onSubmitSeatingFeatures = (data: z.infer<typeof seatingFeaturesSchema>) => {
    toast({
      title: "Seating Features Updated",
      description: "Your seating features settings have been updated successfully.",
    });
    console.log("Seating Features:", data);
  };

  const onSubmitReservationRules = (data: z.infer<typeof reservationRulesSchema>) => {
    toast({
      title: "Reservation Rules Updated",
      description: "Your reservation rules have been updated successfully.",
    });
    console.log("Reservation Rules:", data);
  };

  const zones: { value: SeatZone, label: string }[] = [
    { value: "full-day", label: "Full Day Zone" },
    { value: "half-day", label: "Half Day Zone" },
    { value: "reading-area", label: "Reading Area" },
    { value: "computer-zone", label: "Computer Zone" },
    { value: "quiet-study", label: "Quiet Study" },
    { value: "group-study", label: "Group Study" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and preferences
          </p>
        </div>

        <Tabs defaultValue="layout" className="space-y-4">
          <TabsList>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="time">
              <Clock className="w-4 h-4 mr-2" />
              Time Settings
            </TabsTrigger>
          </TabsList>

          {/* Layout Settings */}
          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Seat Layout Configuration</CardTitle>
                <CardDescription>
                  Configure the seating arrangement and layout settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Left Side Columns</Label>
                    <Input type="number" value="3" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Right Side Columns</Label>
                    <Input type="number" value="4" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Rows</Label>
                  <Input type="number" value="14" disabled />
                            </div>
                <div className="space-y-2">
                  <Label>Grid Gap</Label>
                  <Input type="number" value="1" disabled />
                            </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-refresh" />
                  <Label htmlFor="auto-refresh">Auto-refresh seat status</Label>
                    </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" />
                  <Label htmlFor="email-notifications">Email notifications</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <Switch id="push-notifications" />
                  <Label htmlFor="push-notifications">Push notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="booking-alerts" />
                  <Label htmlFor="booking-alerts">Booking alerts</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Settings */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Configure user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-approve" />
                  <Label htmlFor="auto-approve">Auto-approve new users</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <Switch id="require-verification" />
                  <Label htmlFor="require-verification">Require email verification</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Settings */}
          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Time Settings</CardTitle>
                <CardDescription>
                  Configure time-related settings and schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Booking Duration (minutes)</Label>
                  <Input type="number" defaultValue="120" />
                    </div>
                <div className="space-y-2">
                  <Label>Maximum Booking Duration (minutes)</Label>
                  <Input type="number" defaultValue="240" />
                  </div>
                <div className="flex items-center space-x-2">
                  <Switch id="allow-extensions" />
                  <Label htmlFor="allow-extensions">Allow booking extensions</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
