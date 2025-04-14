
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
  Upload,
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
  phone: z.string().optional(),
  status: z.enum(["active", "pending", "banned"]),
  // We don't validate file uploads in the schema as they're handled separately
});

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);
  
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      studentId: "",
      phone: "",
      status: "active",
    },
  });

  function onSubmit(values: z.infer<typeof studentFormSchema>) {
    toast({
      title: "Student Added",
      description: `Student "${values.name}" has been added successfully.`,
    });
    console.log({
      ...values,
      profilePhoto: profilePhoto ? profilePhoto.name : null,
      idProof: idProof ? idProof.name : null
    });
    form.reset();
    setProfilePhoto(null);
    setIdProof(null);
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProof(e.target.files[0]);
    }
  };

  // Mock student details data
  const studentDetails = {
    name: "Alex Johnson",
    email: "alex.j@example.edu",
    id: "STU1001",
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {profilePhoto ? (
                              <img 
                                src={URL.createObjectURL(profilePhoto)} 
                                alt="Profile Preview" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleProfilePhotoChange}
                            />
                            <FormDescription>
                              Upload a profile photo (JPG or PNG).
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Upload ID</FormLabel>
                        <div className="flex items-center gap-4">
                          <Upload className={`h-8 w-8 ${idProof ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <Input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png" 
                              onChange={handleIdProofChange}
                            />
                            <FormDescription>
                              Upload a valid ID document (PDF, JPG or PNG).
                            </FormDescription>
                          </div>
                        </div>
                        {idProof && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Selected file: {idProof.name}
                          </p>
                        )}
                      </FormItem>

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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
