import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentTable from "@/components/dashboard/StudentTable";
import InteractiveSeatMap from "@/components/dashboard/InteractiveSeatMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  UserCheck,
  FileText,
  Mail,
  Calendar,
  Users,
  AlertTriangle,
  Loader2,
  Plus,
  User,
  UserCog,
  IdCard,
  Phone,
  Image,
  File,
  CheckCircle,
  XCircle,
  Clock,
  Sofa
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { studentService } from '@/services/api';

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const { toast } = useToast();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    fatherName: "",
    studentId: "",
    email: "",
    phone: "",
    profilePhoto: null,
    idProof: null,
    status: "pending",
    seatNumber: ""
  });
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);

  // Student overview statistics
  const studentStats = {
    total: 5,
    active: 3,
    pending: 1,
    banned: 1,
    newThisMonth: 2,
    violations: 5
  };

  // Make sure percentages are calculated safely
  const activePercentage = studentStats.total > 0 
    ? ((studentStats.active / studentStats.total) * 100).toFixed(1) 
    : "0.0";

  // Mock student data using useMemo to prevent recreation on every render
  const studentsData = React.useMemo(() => [
    {
      id: "STU1001",
      name: "Alex Johnson",
      email: "alex.j@example.edu",
      registeredOn: "2023-09-15",
      status: "active",
      lastActive: "10 mins ago",
      photo: "/placeholder.svg",
      idProof: "ID12345",
      bookings: 28,
      violations: 0,
      phone: "+1 555-123-4567",
      address: "123 Campus Drive, University Housing Block A",
      priority: "high",
      notes: "Scholarship student. Regular visitor to the study areas."
    },
    {
      id: "STU1002",
      name: "Samantha Lee",
      email: "slee@example.edu",
      registeredOn: "2023-08-22",
      status: "active",
      lastActive: "2 hours ago",
      photo: "/placeholder.svg",
      idProof: "ID12346",
      bookings: 15,
      violations: 1,
      phone: "+1 555-987-6543",
      address: "456 University Ave, Apartment 2B",
      priority: "medium",
      notes: "Research assistant in Biology department. Uses computer labs frequently."
    },
    {
      id: "STU1003",
      name: "David Martinez",
      email: "dmartinez@example.edu",
      registeredOn: "2023-10-05",
      status: "suspended",
      lastActive: "3 days ago",
      photo: "/placeholder.svg",
      idProof: "ID12347",
      bookings: 32,
      violations: 3,
      phone: "+1 555-456-7890",
      address: "789 College Blvd, Dorm 3C",
      priority: "low",
      notes: "Suspended due to multiple noise complaints and disruptive behavior."
    },
    {
      id: "STU1004",
      name: "Priya Patel",
      email: "ppatel@example.edu",
      registeredOn: "2023-07-30",
      status: "pending",
      lastActive: "Just now",
      photo: "/placeholder.svg",
      idProof: "ID12348",
      bookings: 5,
      violations: 0,
      phone: "+1 555-234-5678",
      address: "101 Study Lane, Housing Complex D",
      priority: "medium",
      notes: "Exchange student. Registration pending ID verification."
    },
    {
      id: "STU1005",
      name: "Michael Wong",
      email: "mwong@example.edu",
      registeredOn: "2023-09-02",
      status: "active",
      lastActive: "5 hours ago",
      photo: "/placeholder.svg",
      idProof: "ID12349",
      bookings: 17,
      violations: 1,
      phone: "+1 555-876-5432",
      address: "202 Academia Road, Apartment 4A",
      priority: "high",
      notes: "Student council member. Has extended access privileges."
    }
  ], []);

  // Function to handle filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Generate filtered and sorted students list based on search, filters, and sort
  const filteredAndSortedStudents = React.useMemo(() => {
    let filtered = [...studentsData];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(student => student.priority === priorityFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(search) || 
        student.id.toLowerCase().includes(search) || 
        student.email.toLowerCase().includes(search) ||
        (student.phone && student.phone.toLowerCase().includes(search))
      );
    }
    
    // Sort students
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'lastActive':
          comparison = a.lastActive.localeCompare(b.lastActive);
          break;
        case 'priority': {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [studentsData, sortField, sortDirection, statusFilter, priorityFilter, searchTerm]);

  // Function to handle student editing
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    toast({
      title: "Edit Initiated",
      description: `Opening editor for student ${student.name}`,
    });
    // In a real app, you would open a dialog or form for editing
  };

  const handleAddStudent = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('name', newStudent.name);
      formData.append('fatherName', newStudent.fatherName);
      formData.append('studentId', newStudent.studentId);
      formData.append('email', newStudent.email);
      formData.append('phone', newStudent.phone);
      formData.append('status', newStudent.status);
      formData.append('seatNumber', newStudent.seatNumber);
      if (newStudent.profilePhoto) {
        formData.append('profilePhoto', newStudent.profilePhoto);
      }
      if (newStudent.idProof) {
        formData.append('idProof', newStudent.idProof);
      }

      // Call the API
      await studentService.createStudent(formData);

      // Show success message
      toast({
        title: "Success",
        description: "Student added successfully",
      });

      // Reset form and close dialog
      setIsAddStudentOpen(false);
      setNewStudent({
        name: "",
        fatherName: "",
        studentId: "",
        email: "",
        phone: "",
        profilePhoto: null,
        idProof: null,
        status: "pending",
        seatNumber: ""
      });

      // Refresh students list
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentService.getStudents();
      setStudents(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading student data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-600">STUDENT MANAGEMENT</h1>
            <p className="text-muted-foreground">Manage student profiles and access</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Fill in the student details below. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input
                        id="fatherName"
                        value={newStudent.fatherName}
                        onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                        placeholder="Enter father's name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={newStudent.studentId}
                        onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                        placeholder="Enter student ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seatNumber">Seat Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="seatNumber"
                          value={newStudent.seatNumber}
                          onChange={(e) => setNewStudent({ ...newStudent, seatNumber: e.target.value })}
                          placeholder="Enter seat number"
                          readOnly
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsSeatSelectionOpen(true)}
                          className="flex items-center gap-2"
                        >
                          <Sofa className="h-4 w-4" />
                          Select Seat
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profilePhoto">Profile Photo</Label>
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewStudent({ ...newStudent, profilePhoto: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idProof">ID Proof</Label>
                      <Input
                        id="idProof"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setNewStudent({ ...newStudent, idProof: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notification to Students</DialogTitle>
                  <DialogDescription>
                    This will send a notification to all students or selected group of students.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">Feature coming soon</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{studentStats.newThisMonth} this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.active.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {activePercentage}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Require verification
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.violations}</div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <StudentTable 
            students={students}
            filteredAndSortedStudents={filteredAndSortedStudents}
            editStudent={handleEditStudent}
          />
        </div>

        {/* Seat Selection Dialog */}
        <Dialog open={isSeatSelectionOpen} onOpenChange={setIsSeatSelectionOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select a Seat</DialogTitle>
              <DialogDescription>
                Choose an available seat for the student. Green seats are available for selection.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <InteractiveSeatMap 
                showOnlyAvailable={true}
                onSeatSelect={(seatNumber) => {
                  setNewStudent({ ...newStudent, seatNumber });
                  setIsSeatSelectionOpen(false);
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSeatSelectionOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
