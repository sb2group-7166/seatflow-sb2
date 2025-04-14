
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
import { Armchair, BookOpen, CalendarDays, Clock, Layout, MapPin, Settings as SettingsIcon, Sofa, Users } from "lucide-react";

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
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure system-wide preferences and settings</p>
        </div>

        <Tabs defaultValue="seating">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="seating">Seating</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="seating" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Seating Layout</CardTitle>
                    <CardDescription>Configure how seats are organized and displayed</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Layout className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...seatingLayoutForm}>
                  <form onSubmit={seatingLayoutForm.handleSubmit(onSubmitSeatingLayout)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={seatingLayoutForm.control}
                        name="seatingMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seating Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select seating mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="social-distance">Social Distancing</SelectItem>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How seats are arranged and spaced
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingLayoutForm.control}
                        name="defaultLayout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Layout</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select layout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="classroom">Classroom Style</SelectItem>
                                <SelectItem value="theater">Theater Style</SelectItem>
                                <SelectItem value="u-shape">U-Shape</SelectItem>
                                <SelectItem value="boardroom">Boardroom</SelectItem>
                                <SelectItem value="cluster">Cluster Groups</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Default arrangement of seats
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingLayoutForm.control}
                        name="rowSpacing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Row Spacing</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select row spacing" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="compact">Compact (30cm)</SelectItem>
                                <SelectItem value="normal">Normal (60cm)</SelectItem>
                                <SelectItem value="spacious">Spacious (90cm)</SelectItem>
                                <SelectItem value="extra">Extra Spacious (120cm)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Distance between rows
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingLayoutForm.control}
                        name="seatSpacing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seat Spacing</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select seat spacing" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="compact">Compact (30cm)</SelectItem>
                                <SelectItem value="normal">Normal (50cm)</SelectItem>
                                <SelectItem value="spacious">Spacious (70cm)</SelectItem>
                                <SelectItem value="extra">Extra Spacious (90cm)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Distance between adjacent seats
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={seatingLayoutForm.control}
                        name="autoNumbering"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Auto Numbering</FormLabel>
                              <FormDescription>
                                Automatically number seats sequentially
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingLayoutForm.control}
                        name="enableGroupBooking"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable Group Booking</FormLabel>
                              <FormDescription>
                                Allow booking multiple adjacent seats
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Layout Settings</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Seating Features</CardTitle>
                    <CardDescription>Configure booking and reservation options</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Sofa className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...seatingFeaturesForm}>
                  <form onSubmit={seatingFeaturesForm.handleSubmit(onSubmitSeatingFeatures)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={seatingFeaturesForm.control}
                        name="allowMultiDayBooking"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow Multi-Day Bookings</FormLabel>
                              <FormDescription>
                                Enable students to book seats for multiple consecutive days
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="maxHoursPerBooking"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Hours Per Booking</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="1" max="24" />
                            </FormControl>
                            <FormDescription>
                              Maximum hours a student can book a seat for
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="requireApproval"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Require Staff Approval</FormLabel>
                              <FormDescription>
                                Bookings need approval before confirmation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="allowStudentCancellation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow Student Cancellation</FormLabel>
                              <FormDescription>
                                Students can cancel their own reservations
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="enableWaitlist"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Enable Waitlist</FormLabel>
                              <FormDescription>
                                Allow students to join waitlists for fully booked sessions
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="preventDoubleBooking"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Prevent Double Booking</FormLabel>
                              <FormDescription>
                                Prevent students from booking multiple seats at the same time
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seatingFeaturesForm.control}
                        name="requireStudentVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Require Student Verification</FormLabel>
                              <FormDescription>
                                Students must verify identity when claiming seat
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Feature Settings</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Reservation Rules</CardTitle>
                    <CardDescription>Set policies for seat reservations</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...reservationRulesForm}>
                  <form onSubmit={reservationRulesForm.handleSubmit(onSubmitReservationRules)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={reservationRulesForm.control}
                        name="maxDaysInAdvance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Days in Advance</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="1" max="30" />
                            </FormControl>
                            <FormDescription>
                              How many days in advance can seats be booked
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reservationRulesForm.control}
                        name="maxActiveReservations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Active Reservations</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="1" max="10" />
                            </FormControl>
                            <FormDescription>
                              Maximum number of active reservations per student
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reservationRulesForm.control}
                        name="bookingCooldown"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Booking Cooldown (hours)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="0" max="72" />
                            </FormControl>
                            <FormDescription>
                              Required waiting time between bookings
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reservationRulesForm.control}
                        name="lateArrivalPolicy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Late Arrival Grace Period (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="0" max="60" />
                            </FormControl>
                            <FormDescription>
                              Minutes before a reservation is released if student hasn't arrived
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reservationRulesForm.control}
                        name="noShowPenalty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No-Show Penalty (days)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="0" max="30" />
                            </FormControl>
                            <FormDescription>
                              Days a student is restricted after not showing up for a reservation
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Reservation Rules</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Zone Management</CardTitle>
                    <CardDescription>Configure seating zones and their properties</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zones.map(zone => (
                    <div key={zone.value} className="border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{zone.label}</h4>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Zone type: {zone.value}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Add New Zone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how notifications are sent to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">New Booking Confirmations</h4>
                      <p className="text-sm text-muted-foreground">Send email when a booking is confirmed</p>
                    </div>
                    <Switch checked />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Booking Reminders</h4>
                      <p className="text-sm text-muted-foreground">Send reminders before scheduled bookings</p>
                    </div>
                    <Switch checked />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Cancellation Alerts</h4>
                      <p className="text-sm text-muted-foreground">Notify when a booking is cancelled</p>
                    </div>
                    <Switch checked />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">System Alerts</h4>
                      <p className="text-sm text-muted-foreground">Receive important system notifications</p>
                    </div>
                    <Switch checked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Debug Mode</h4>
                      <p className="text-sm text-muted-foreground">Enable additional logging</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Toggle dark mode interface</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Automatic Logout</h4>
                      <p className="text-sm text-muted-foreground">Log out inactive users automatically</p>
                    </div>
                    <Switch checked />
                  </div>
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
