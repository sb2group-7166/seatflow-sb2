
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Bell,
  Mail,
  MessageSquare,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Filter,
  MoreHorizontal,
  Search,
  User,
  RefreshCcw,
  ArrowRightCircle,
  PlusCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Mock notifications data
const notifications = [
  {
    id: "notif1",
    title: "Shift Change Alert",
    message: "Morning shift is ending in 30 minutes. Please prepare for the transition.",
    type: "shift",
    status: "unread",
    timestamp: "2023-04-13T11:30:00Z",
    priority: "medium"
  },
  {
    id: "notif2",
    title: "New Student Registration",
    message: "Student Alex Johnson (STU1001) has registered and requires verification.",
    type: "student",
    status: "unread",
    timestamp: "2023-04-13T10:15:00Z",
    priority: "low"
  },
  {
    id: "notif3",
    title: "Seat Allocation Issue",
    message: "Double booking detected for Seat #12 in Reading Area. Immediate attention required.",
    type: "seat",
    status: "unread",
    timestamp: "2023-04-13T09:45:00Z",
    priority: "high"
  },
  {
    id: "notif4",
    title: "Payment Failed",
    message: "Payment for booking #B1004 by Priya Patel (STU1004) has failed.",
    type: "payment",
    status: "read",
    timestamp: "2023-04-12T16:20:00Z",
    priority: "medium"
  },
  {
    id: "notif5",
    title: "Low Seat Availability",
    message: "Quiet Study zone is at 90% capacity. Consider reallocation measures.",
    type: "seat",
    status: "read",
    timestamp: "2023-04-12T14:10:00Z",
    priority: "low"
  }
];

// Mock templates
const notificationTemplates = [
  {
    id: "template1",
    name: "Seat Booking Confirmation",
    subject: "Your Seat Booking is Confirmed",
    content: "Dear {studentName},\n\nYour booking for seat #{seatNumber} in the {zone} zone on {date} from {startTime} to {endTime} has been confirmed.\n\nThank you for using our service.\n\nRegards,\nSB2 Library"
  },
  {
    id: "template2",
    name: "Booking Cancellation",
    subject: "Seat Booking Cancellation",
    content: "Dear {studentName},\n\nYour booking for seat #{seatNumber} in the {zone} zone on {date} has been cancelled.\n\n{reasonIfAny}\n\nRegards,\nSB2 Library"
  },
  {
    id: "template3",
    name: "Payment Receipt",
    subject: "Payment Receipt for SB2 Library Services",
    content: "Dear {studentName},\n\nThank you for your payment of ${amount} for {service}.\n\nTransaction ID: {transactionId}\nDate: {date}\n\nRegards,\nSB2 Library"
  },
  {
    id: "template4",
    name: "Shift Change Reminder",
    subject: "Upcoming Shift Change at SB2 Library",
    content: "Dear Staff,\n\nThis is a reminder that the {currentShift} shift is ending in 30 minutes. Please prepare for the transition to the {nextShift} shift.\n\nRegards,\nSB2 Library Administration"
  }
];

// Form schema for creating a notification
const notificationFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  type: z.enum(["all", "shift", "student", "seat", "payment"]),
  priority: z.enum(["low", "medium", "high"]),
  sendEmail: z.boolean().default(false),
  sendSMS: z.boolean().default(false),
});

const NotificationsPage = () => {
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // Form for creating/sending notifications
  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "all",
      priority: "medium",
      sendEmail: false,
      sendSMS: false,
    },
  });

  // Form submit handler
  function onSubmit(values: z.infer<typeof notificationFormSchema>) {
    toast({
      title: "Notification Sent",
      description: "Your notification has been sent successfully.",
    });
    console.log(values);
    form.reset();
  }
  
  // Helper function for notification type icons
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "shift":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "student":
        return <User className="h-5 w-5 text-green-500" />;
      case "seat":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "payment":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function for priority badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage notifications, alerts, and communication settings
          </p>
        </div>

        <Tabs defaultValue="inbox">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Notification Inbox</CardTitle>
                    <CardDescription>
                      View and manage system notifications
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search notifications..."
                        className="w-full sm:w-[200px] pl-8"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <RefreshCcw className="h-4 w-4" />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`flex items-start p-4 border-b last:border-b-0 ${
                        notification.status === "unread" ? "bg-muted/30" : ""
                      } ${selectedNotification === notification.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedNotification(notification.id)}
                    >
                      <div className="mr-4 mt-0.5">
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            notification.status === "unread" ? "font-semibold" : ""
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center">
                            {getPriorityBadge(notification.priority)}
                            <Button variant="ghost" size="icon" className="ml-1">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                      {notification.status === "unread" && (
                        <div className="ml-2 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 5 of 25 notifications
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <Button variant="outline" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Mark All as Read
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm">
                      Delete Selected
                    </Button>
                    <Button size="sm">View All</Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">System Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app alerts and notifications
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked/>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked/>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via SMS
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Scheduled Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive daily and weekly summaries
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Send Tab */}
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>Send Notification</CardTitle>
                <CardDescription>
                  Create and send new notifications to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter notification title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Enter notification message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notification Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="shift">Shift Related</SelectItem>
                                <SelectItem value="student">Student Related</SelectItem>
                                <SelectItem value="seat">Seat Related</SelectItem>
                                <SelectItem value="payment">Payment Related</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Type determines the target audience
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Determines notification visibility and urgency
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-medium">Delivery Methods</h3>
                      
                      <div className="flex flex-col md:flex-row gap-6">
                        <FormField
                          control={form.control}
                          name="sendEmail"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3 flex-1">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Email</FormLabel>
                                <FormDescription>
                                  Send notification via email
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
                          control={form.control}
                          name="sendSMS"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3 flex-1">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">SMS</FormLabel>
                                <FormDescription>
                                  Send notification via SMS
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
                      
                      <p className="text-sm text-muted-foreground">
                        System notifications are always sent regardless of these settings
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto gap-2">
                      <Send className="h-4 w-4" />
                      Send Notification
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Template Library</CardTitle>
                  <CardDescription>
                    Manage notification templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {notificationTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {template.subject}
                        </p>
                      </div>
                      <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Template
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Template Editor</CardTitle>
                  <CardDescription>
                    Preview and edit notification templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Template Name</label>
                    <Input defaultValue="Seat Booking Confirmation" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input defaultValue="Your Seat Booking is Confirmed" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Dear {studentName},

Your booking for seat #{seatNumber} in the {zone} zone on {date} from {startTime} to {endTime} has been confirmed.

Thank you for using our service.

Regards,
SB2 Library"
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium mb-1">Available Variables</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/10">studentName</Badge>
                      <Badge variant="outline" className="bg-primary/10">seatNumber</Badge>
                      <Badge variant="outline" className="bg-primary/10">zone</Badge>
                      <Badge variant="outline" className="bg-primary/10">date</Badge>
                      <Badge variant="outline" className="bg-primary/10">startTime</Badge>
                      <Badge variant="outline" className="bg-primary/10">endTime</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Preview</Button>
                  <div className="flex gap-2">
                    <Button variant="destructive">Delete</Button>
                    <Button>Save Template</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
