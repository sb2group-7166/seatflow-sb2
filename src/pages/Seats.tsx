
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SeatMap from "@/components/dashboard/SeatMap";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  QrCode, 
  Map, 
  PlusCircle, 
  Rows3, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema for seat configuration form
const seatConfigSchema = z.object({
  zone: z.string(),
  totalSeats: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Total seats must be a number.",
  }),
  rows: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Rows must be a number.",
  }),
  columns: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Columns must be a number.",
  }),
  seatType: z.string(),
});

// Mock booking data
const recentBookings = [
  { 
    id: "B1001", 
    studentName: "Alex Johnson", 
    studentId: "STU1001", 
    seatNumber: 5, 
    zone: "Reading Area", 
    timeStart: "10:30 AM", 
    timeEnd: "01:30 PM", 
    status: "active" 
  },
  { 
    id: "B1002", 
    studentName: "Samantha Lee", 
    studentId: "STU1002", 
    seatNumber: 12, 
    zone: "Computer Zone", 
    timeStart: "09:15 AM", 
    timeEnd: "12:15 PM", 
    status: "active" 
  },
  { 
    id: "B1003", 
    studentName: "David Martinez", 
    studentId: "STU1003", 
    seatNumber: 8, 
    zone: "Quiet Study", 
    timeStart: "11:00 AM", 
    timeEnd: "02:00 PM", 
    status: "completed" 
  },
  { 
    id: "B1004", 
    studentName: "Priya Patel", 
    studentId: "STU1004", 
    seatNumber: 21, 
    zone: "Group Study", 
    timeStart: "02:30 PM", 
    timeEnd: "05:30 PM", 
    status: "cancelled" 
  }
];

const SeatsPage = () => {
  const { toast } = useToast();
  const [view, setView] = useState("seats");
  
  // Form for configuring seats
  const form = useForm<z.infer<typeof seatConfigSchema>>({
    resolver: zodResolver(seatConfigSchema),
    defaultValues: {
      zone: "reading-area",
      totalSeats: "24",
      rows: "4",
      columns: "6",
      seatType: "standard",
    },
  });

  function onSubmit(values: z.infer<typeof seatConfigSchema>) {
    toast({
      title: "Seat Configuration Updated",
      description: `The ${values.zone} has been updated with ${values.totalSeats} seats.`,
    });
    console.log(values);
  }

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seat Management</h1>
          <p className="text-muted-foreground">
            Manage and configure library seating arrangements
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">240</div>
                    <Rows3 className="h-8 w-8 text-primary/70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Across all zones</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Available Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-success">78</div>
                    <CheckCircle2 className="h-8 w-8 text-success/70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">32.5% of total capacity</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Occupied Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-destructive">162</div>
                    <XCircle className="h-8 w-8 text-destructive/70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">67.5% of total capacity</p>
                </CardContent>
              </Card>
            </div>

            {/* Seat Map */}
            <SeatMap className="mb-6" />

            {/* Zones Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Zones Summary</CardTitle>
                <CardDescription>Current status across different library zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reading Area */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Reading Area</h3>
                      <Badge variant="outline" className="bg-success/10 border-success text-success">71% Available</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 px-2 py-1 rounded text-sm">24 Total Seats</div>
                      <div className="bg-success/10 px-2 py-1 rounded text-success text-sm">17 Available</div>
                      <div className="bg-destructive/10 px-2 py-1 rounded text-destructive text-sm">7 Occupied</div>
                    </div>
                  </div>

                  {/* Computer Zone */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Computer Zone</h3>
                      <Badge variant="outline" className="bg-warning/10 border-warning text-warning">30% Available</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 px-2 py-1 rounded text-sm">18 Total Seats</div>
                      <div className="bg-success/10 px-2 py-1 rounded text-success text-sm">5 Available</div>
                      <div className="bg-destructive/10 px-2 py-1 rounded text-destructive text-sm">13 Occupied</div>
                    </div>
                  </div>

                  {/* Quiet Study */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Quiet Study</h3>
                      <Badge variant="outline" className="bg-destructive/10 border-destructive text-destructive">12% Available</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 px-2 py-1 rounded text-sm">16 Total Seats</div>
                      <div className="bg-success/10 px-2 py-1 rounded text-success text-sm">2 Available</div>
                      <div className="bg-destructive/10 px-2 py-1 rounded text-destructive text-sm">14 Occupied</div>
                    </div>
                  </div>

                  {/* Group Study */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Group Study</h3>
                      <Badge variant="outline" className="bg-success/10 border-success text-success">58% Available</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 px-2 py-1 rounded text-sm">12 Total Seats</div>
                      <div className="bg-success/10 px-2 py-1 rounded text-success text-sm">7 Available</div>
                      <div className="bg-destructive/10 px-2 py-1 rounded text-destructive text-sm">5 Occupied</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>View and manage seat bookings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search bookings..."
                        className="w-full sm:w-[200px] pl-8"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Student</div>
                    <div>Seat</div>
                    <div>Time</div>
                    <div>Status</div>
                    <div className="text-right">Action</div>
                  </div>
                  
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="grid grid-cols-6 p-3 border-t items-center text-sm">
                      <div className="col-span-2">
                        <p className="font-medium">{booking.studentName}</p>
                        <p className="text-xs text-muted-foreground">{booking.studentId}</p>
                      </div>
                      <div>
                        <p>Seat #{booking.seatNumber}</p>
                        <p className="text-xs text-muted-foreground">{booking.zone}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <div>
                          <p>{booking.timeStart} - {booking.timeEnd}</p>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">Details</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configure Tab */}
          <TabsContent value="configure">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seat Configuration</CardTitle>
                  <CardDescription>
                    Configure seat layout settings for different zones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="zone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="reading-area">Reading Area</SelectItem>
                                <SelectItem value="computer-zone">Computer Zone</SelectItem>
                                <SelectItem value="quiet-study">Quiet Study</SelectItem>
                                <SelectItem value="group-study">Group Study</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the zone to configure
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="totalSeats"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Seats</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="rows"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rows</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="columns"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Columns</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="seatType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seat Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select seat type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="computer">Computer</SelectItem>
                                <SelectItem value="accessible">Accessible</SelectItem>
                                <SelectItem value="group">Group</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Type of seats for this zone
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Save Configuration</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common seat management operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center p-2" onClick={() => {
                      toast({
                        title: "QR Codes Generated",
                        description: "QR codes for all seats have been generated successfully.",
                      });
                    }}>
                      <QrCode className="h-6 w-6 mb-1" />
                      <span>Generate Seat QR Codes</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center p-2" onClick={() => {
                      toast({
                        title: "All Seats Unlocked",
                        description: "All seats have been unlocked successfully.",
                      });
                    }}>
                      <CheckCircle2 className="h-6 w-6 mb-1" />
                      <span>Unlock All Seats</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center p-2" onClick={() => {
                      toast({
                        title: "All Seats Locked",
                        description: "All seats have been locked successfully.",
                      });
                    }}>
                      <AlertCircle className="h-6 w-6 mb-1" />
                      <span>Lock All Seats</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center p-2" onClick={() => {
                      toast({
                        title: "Map View Opened",
                        description: "You can now edit the seat layout.",
                      });
                    }}>
                      <Map className="h-6 w-6 mb-1" />
                      <span>Edit Seat Layout</span>
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Auto Seat Allocation</h3>
                    <p className="text-sm mb-3">Configure how seats are automatically allocated to students.</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default" size="sm">
                        First-come First-served
                      </Button>
                      <Button variant="secondary" size="sm">
                        Priority-based
                      </Button>
                      <Button variant="secondary" size="sm">
                        By Student Year
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SeatsPage;
