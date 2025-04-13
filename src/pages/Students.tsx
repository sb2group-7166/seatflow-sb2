
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentTable from "@/components/dashboard/StudentTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Search,
  UserCheck,
  UserX,
  FileText,
  Mail,
  Phone,
  Calendar,
  School,
  User,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentId: z.string().min(5, {
    message: "Student ID must be at least 5 characters.",
  }),
  year: z.string(),
  phone: z.string().optional(),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  status: z.enum(["active", "pending", "banned"]),
});

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      studentId: "",
      year: "1st Year",
      phone: "",
      department: "",
      status: "active",
    },
  });

  function onSubmit(values: z.infer<typeof studentFormSchema>) {
    toast({
      title: "Student Added",
      description: `Student "${values.name}" has been added successfully.`,
    });
    console.log(values);
    form.reset();
  }

  // Mock student details data
  const studentDetails = {
    name: "Alex Johnson",
    email: "alex.j@example.edu",
    id: "STU1001",
    department: "Computer Science",
    year: "3rd Year",
    joinedOn: "September 15, 2023",
    lastActive: "April 10, 2023 (10:30 AM)",
    status: "active",
    bookings: 28,
    violations: 0,
    phone: "+1 555-123-4567",
    address: "123 Campus Drive, University Housing Block A",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student profiles and access</p>
        </div>

        <Tabs defaultValue="list">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="add">Add Student</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <StudentTable />
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Student</CardTitle>
                <CardDescription>
                  Enter student details to register them in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@university.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <Input placeholder="STU12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                                <SelectItem value="5th Year">5th Year</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Student Detail View (can be opened from the table) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="hidden">View Student</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Student Profile</DialogTitle>
                  <DialogDescription>
                    View detailed information about this student.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div className="flex flex-col items-center justify-center col-span-1 border rounded-md p-4">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">{studentDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">{studentDetails.id}</p>
                    <Badge className="mt-2" variant={studentDetails.status === "active" ? "default" : "destructive"}>
                      {studentDetails.status}
                    </Badge>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm">{studentDetails.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm">{studentDetails.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <p className="text-sm">{studentDetails.department}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Joined On</p>
                          <p className="text-sm">{studentDetails.joinedOn}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Library Usage</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">Total Bookings</p>
                          <p className="text-lg font-medium">{studentDetails.bookings}</p>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">Violations</p>
                          <p className="text-lg font-medium">{studentDetails.violations}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Last Activity</h4>
                      <p className="text-sm">{studentDetails.lastActive}</p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View History
                  </Button>
                  <Button variant="default" className="gap-2">
                    <UserCheck className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
