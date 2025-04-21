import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
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
import { useToast } from "@/components/ui/use-toast";
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
  Sofa,
  UserPlus,
  GraduationCap,
  Activity,
  ChevronRight,
  Search,
  Filter,
  Upload,
  X,
  CreditCard,
  Receipt,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  newStudents: number;
  averageAttendance: number;
  membershipTypes: {
    name: string;
    count: number;
  }[];
  attendanceTrend: {
    date: string;
    attendance: number;
  }[];
  activityHours: {
    hour: string;
    count: number;
  }[];
}

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<null | any>(null);
  const [showLargePhoto, setShowLargePhoto] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    fatherName: '',
    studentId: '',
    email: '',
    phone: '',
    shift: '',
    admissionDate: new Date(),
    address: '',
    idProof: null as File | null,
    profilePhoto: null as File | null
  });
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [stats, setStats] = useState<StudentStats>({
    totalStudents: 0,
    activeStudents: 0,
    newStudents: 0,
    averageAttendance: 0,
    membershipTypes: [],
    attendanceTrend: [],
    activityHours: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFullTable, setShowFullTable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<any>(null);

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
      name: "John Doe",
      email: "jdoe@example.edu",
      registeredOn: "2023-01-15",
      status: "active",
      lastActive: "2 hours ago",
      photo: "/placeholder.svg",
      idProof: "ID12345",
      bookings: 12,
      violations: 2,
      phone: "+1 555-123-4567",
      address: "123 University Ave, Apt 4B",
      priority: "high",
      notes: "Regular student with good attendance",
      seatNo: "A101",
      dueDate: "2024-04-15"
    },
    {
      id: "STU1002",
      name: "Jane Smith",
      email: "jsmith@example.edu",
      registeredOn: "2023-02-20",
      status: "active",
      lastActive: "1 day ago",
      photo: "/placeholder.svg",
      idProof: "ID12346",
      bookings: 8,
      violations: 0,
      phone: "+1 555-987-6543",
      address: "456 College Street, Unit 7",
      priority: "medium",
      notes: "New student, still learning the system",
      seatNo: "B202",
      dueDate: "2024-04-20"
    },
    {
      id: "STU1003",
      name: "Alex Johnson",
      email: "ajohnson@example.edu",
      registeredOn: "2023-05-10",
      status: "suspended",
      lastActive: "1 week ago",
      photo: "/placeholder.svg",
      idProof: "ID12347",
      bookings: 15,
      violations: 3,
      phone: "+1 555-456-7890",
      address: "789 Campus Road, Room 12",
      priority: "low",
      notes: "Multiple violations, currently suspended",
      seatNo: "C303",
      dueDate: "2024-04-25"
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
      notes: "Exchange student. Registration pending ID verification.",
      seatNo: "D404",
      dueDate: "2024-04-30"
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
      notes: "Student council member. Has extended access privileges.",
      seatNo: "E505",
      dueDate: "2024-05-01"
    }
  ], []);

  // Add status types
  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'on_leave', label: 'On Leave' }
  ];

  // Update the filteredAndSortedStudents function
  const filteredAndSortedStudents = React.useMemo(() => {
    let filtered = [...studentsData];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter);
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
    
    return filtered;
  }, [studentsData, statusFilter, searchTerm]);

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
      // Here you would implement your actual API call to add the student
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Student Added",
        description: "New student has been added successfully",
      });
      
      setShowAddForm(false);
      setNewStudent({
        name: '',
        fatherName: '',
        studentId: '',
        email: '',
        phone: '',
        shift: '',
        admissionDate: new Date(),
        address: '',
        idProof: null,
        profilePhoto: null
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Using mock data instead of API call
      setStudents(studentsData);
      // Set the stats based on mock data
      setStats({
        totalStudents: studentsData.length,
        activeStudents: studentsData.filter(s => s.status === 'active').length,
        newStudents: studentsData.filter(s => s.status === 'pending').length,
          averageAttendance: 85,
          membershipTypes: [
            { name: 'Premium', count: 45 },
            { name: 'Standard', count: 75 },
            { name: 'Basic', count: 30 }
          ],
          attendanceTrend: Array.from({ length: 7 }, (_, i) => ({
            date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
            attendance: Math.floor(Math.random() * 20) + 80
          })),
          activityHours: Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            count: Math.floor(Math.random() * 30) + 10
          }))
      });
      } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchStudents();
  }, []);

  const cardData = [
    {
      id: 'active-students',
      title: 'Active Students',
      value: stats.activeStudents,
      icon: UserCheck,
      color: 'from-blue-500 to-blue-600',
      route: '/students',
      description: 'View all active students'
    },
    {
      id: 'add-student',
      title: 'Add Student',
      value: stats.newStudents,
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      route: '/students/add',
      description: 'Register a new student'
    },
    {
      id: 'booking',
      title: 'Booking',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      route: '/students/booking',
      description: 'Manage student bookings'
    },
    {
      id: 'old-students',
      title: 'Old Students',
      value: `${stats.averageAttendance}%`,
      icon: GraduationCap,
      color: 'from-amber-500 to-amber-600',
      route: '/students/old',
      description: 'View old student records'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Here you would implement your actual import logic
      // For example, reading the file and processing the data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Import Successful",
        description: "Students have been imported successfully",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the students",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendNotification = async () => {
    setIsSendingNotification(true);
    try {
      // Here you would implement your actual notification sending logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Notification Sent",
        description: "Notifications have been sent to all students",
      });
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "There was an error sending notifications",
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleFileUpload = (type: 'idProof' | 'profilePhoto', file: File | null) => {
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (type === 'profilePhoto' && !validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid File",
          description: "Please upload a valid image file (JPEG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setNewStudent({ ...newStudent, [type]: file });
    }
  };

  // Add photo modal component
  const PhotoModal = () => {
    if (!selectedStudent || !showLargePhoto) return null;

    return (
      <Dialog open={showLargePhoto} onOpenChange={setShowLargePhoto}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="relative">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Profile Photo</DialogTitle>
                <DialogDescription className="text-blue-100 text-sm">
                  {selectedStudent.name}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4">
              <div className="relative aspect-square w-full max-h-[400px] rounded-lg overflow-hidden">
                <img
                  src={selectedStudent.photo || "/placeholder.svg"}
                  alt={selectedStudent.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="bg-gray-50 px-3 py-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowLargePhoto(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Add this function to handle edit mode
  const handleEditClick = (student: any) => {
    setEditedStudent({ ...student });
    setIsEditing(true);
  };

  // Add this function to handle save
  const handleSave = async () => {
    try {
      // Here you would implement your actual API call to update the student
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Student information updated successfully",
      });
      
      setSelectedStudent(editedStudent);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student information",
        variant: "destructive",
      });
    }
  };

  // Add this function to handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setEditedStudent(null);
  };

  // Update the StudentDetailsModal component
  const StudentDetailsModal = () => {
    if (!selectedStudent) return null;
    const student = isEditing ? editedStudent : selectedStudent;

    return (
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="h-screen w-screen max-w-none p-0 overflow-hidden">
          <div className="relative h-full flex flex-col">
            {/* Header with close button */}
            <div className="bg-white border-b p-2 flex items-center justify-between">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">Student Profile</DialogTitle>
                <DialogDescription className="text-gray-500 text-xs">
                  {isEditing ? "Edit student information" : `Complete information for ${student.name}`}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Give Notice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Left Side - Student Profile */}
              <div className="w-2/5 border-r overflow-y-auto p-4 space-y-4 h-[calc(100vh-8rem)]">
                {/* Profile Photo Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-0 z-10">
                  <div className="flex items-center gap-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-40 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={student.photo || "/placeholder.svg"}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name and ID */}
                    <div className="flex flex-col gap-1">
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            value={student.name}
                            onChange={(e) => setEditedStudent({ ...student, name: e.target.value })}
                            placeholder="Full Name"
                            className="text-xl font-semibold"
                          />
                          <Input
                            value={student.id}
                            onChange={(e) => setEditedStudent({ ...student, id: e.target.value })}
                            placeholder="Student ID"
                            className="text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-500">ID: {student.id}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                    <User className="h-4 w-4 text-gray-500" />
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Full Name *</Label>
                        {isEditing ? (
                          <Input
                            value={student.name}
                            onChange={(e) => setEditedStudent({ ...student, name: e.target.value })}
                            placeholder="Enter student's full name"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.name || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Father's/Husband's Name *</Label>
                        {isEditing ? (
                          <Input
                            value={student.fatherName}
                            onChange={(e) => setEditedStudent({ ...student, fatherName: e.target.value })}
                            placeholder="Enter father's/husband's name"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.fatherName || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Date of Birth *</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={student.dob}
                            onChange={(e) => setEditedStudent({ ...student, dob: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.dob ? format(new Date(student.dob), "MMMM do, yyyy") : '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Gender *</Label>
                        {isEditing ? (
                          <Select
                            value={student.gender}
                            onValueChange={(value) => setEditedStudent({ ...student, gender: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.gender || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    Academic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Seat Number</Label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              value={student.seatNo}
                              onChange={(e) => setEditedStudent({ ...student, seatNo: e.target.value })}
                              placeholder="Enter seat number"
                            />
                            <Button variant="outline" size="sm">Select Seat</Button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.seatNo || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Admission Date *</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={student.admissionDate}
                            onChange={(e) => setEditedStudent({ ...student, admissionDate: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.admissionDate ? format(new Date(student.admissionDate), "MMMM do, yyyy") : '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Course *</Label>
                        {isEditing ? (
                          <Input
                            value={student.course}
                            onChange={(e) => setEditedStudent({ ...student, course: e.target.value })}
                            placeholder="Enter course name"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.course || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Shift</Label>
                        {isEditing ? (
                          <Select
                            value={student.shift}
                            onValueChange={(value) => setEditedStudent({ ...student, shift: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select shift" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning Shift</SelectItem>
                              <SelectItem value="afternoon">Afternoon Shift</SelectItem>
                              <SelectItem value="evening">Evening Shift</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm font-medium text-gray-900 pl-0">{student.shift || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Seat Number</Label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            value={student.seatNo}
                            onChange={(e) => setEditedStudent({ ...student, seatNo: e.target.value })}
                            placeholder="Enter seat number"
                          />
                          <Button variant="outline" size="sm">Select Seat</Button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{student.seatNo || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Email Address *</Label>
                        {isEditing ? (
                          <Input
                            value={student.email}
                            onChange={(e) => setEditedStudent({ ...student, email: e.target.value })}
                            placeholder="Enter student's email"
                            type="email"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.email || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Phone Number *</Label>
                        {isEditing ? (
                          <Input
                            value={student.phone}
                            onChange={(e) => setEditedStudent({ ...student, phone: e.target.value })}
                            placeholder="Enter student's phone number"
                            type="tel"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.phone || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">WhatsApp Number</Label>
                      {isEditing ? (
                        <Input
                          value={student.whatsapp}
                          onChange={(e) => setEditedStudent({ ...student, whatsapp: e.target.value })}
                          placeholder="Enter WhatsApp number (if different from phone)"
                          type="tel"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{student.whatsapp || '-'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Address *</Label>
                      {isEditing ? (
                        <Textarea
                          value={student.address}
                          onChange={(e) => setEditedStudent({ ...student, address: e.target.value })}
                          placeholder="Enter student's address"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{student.address || '-'}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">City</Label>
                        {isEditing ? (
                          <Input
                            value={student.city}
                            onChange={(e) => setEditedStudent({ ...student, city: e.target.value })}
                            placeholder="City"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.city || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">State</Label>
                        {isEditing ? (
                          <Input
                            value={student.state}
                            onChange={(e) => setEditedStudent({ ...student, state: e.target.value })}
                            placeholder="State"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.state || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">Pincode</Label>
                        {isEditing ? (
                          <Input
                            value={student.pincode}
                            onChange={(e) => setEditedStudent({ ...student, pincode: e.target.value })}
                            placeholder="Pincode"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.pincode || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Proof Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    ID Proof
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-500">ID Proof Type *</Label>
                        {isEditing ? (
                          <Select
                            value={student.idProofType}
                            onValueChange={(value) => setEditedStudent({ ...student, idProofType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID proof type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aadhar">Aadhar Card</SelectItem>
                              <SelectItem value="pan">PAN Card</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="voter">Voter ID</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.idProofType || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-500">ID Proof Number *</Label>
                        {isEditing ? (
                          <Input
                            value={student.idProofNumber}
                            onChange={(e) => setEditedStudent({ ...student, idProofNumber: e.target.value })}
                            placeholder="Enter ID proof number"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{student.idProofNumber || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">ID Proof Front</p>
                        <div className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={student.idProofFront || "/placeholder.svg"}
                            alt="ID Front"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">ID Proof Back</p>
                        <div className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={student.idProofBack || "/placeholder.svg"}
                            alt="ID Back"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Accepted formats: PDF, JPEG, PNG (max 5MB)</p>
                  </div>
                </div>

                {/* Terms & Conditions Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Terms & Conditions</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">1. I hereby declare that all the information provided above is true and correct to the best of my knowledge.</p>
                    <p className="text-xs text-gray-500">2. I understand that any false information provided may result in cancellation of my admission.</p>
                    <p className="text-xs text-gray-500">3. I agree to abide by all the rules and regulations of the institution.</p>
                    <p className="text-xs text-gray-500">4. I understand that the institution reserves the right to modify the rules and regulations as deemed necessary.</p>
                  </div>
                </div>

                {/* Declaration Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Declaration</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">I hereby declare that I have read and understood all the terms and conditions mentioned above and agree to abide by them.</p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Signature</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Student's Signature</p>
                      <div className="h-16 w-full border-b-2 border-gray-300"></div>
                      <p className="text-xs text-gray-500">Date: {format(new Date(), "dd/MM/yyyy")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Authorities Signature & Seal</p>
                      <div className="h-16 w-full border-b-2 border-gray-300"></div>
                      <p className="text-xs text-gray-500">Date: {format(new Date(), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Financial Summary */}
              <div className="w-3/5 overflow-y-auto p-4 space-y-4 h-[calc(100vh-8rem)]">
                <div className="bg-white rounded-lg border border-gray-200">
                  <Tabs defaultValue="admission" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none">
                      <TabsTrigger value="admission" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Admission Form
                      </TabsTrigger>
                      <TabsTrigger value="passbook" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Passbook
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="admission" className="p-4">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-start justify-between border-b pb-4">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">Library Name</h2>
                                <p className="text-sm text-gray-500">Address of library</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Generated on</p>
                              <p className="text-sm font-medium text-gray-900">{format(new Date(), "MMMM do, yyyy")}</p>
                            </div>
                          </div>

                          {/* Student Profile Section */}
                          <div className="flex gap-24 border-b pb-6">
                            {/* Profile Photo */}
                            <div className="flex flex-col items-center">
                              <div className="w-32 h-40 border-2 border-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={student.photo || "/placeholder.svg"}
                                  alt={student.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Student Details */}
                            <div className="flex-1 flex flex-col items-center justify-center px-8">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4">{student.name}</h3>
                              <table className="w-full border-collapse">
                                <tbody>
                                  <tr>
                                    <td className="p-2 border border-gray-200">
                                      <p className="text-sm text-gray-500">Student ID</p>
                                      <p className="text-base font-medium text-gray-900">{student.id || '-'}</p>
                                    </td>
                                    <td className="p-2 border border-gray-200">
                                      <p className="text-sm text-gray-500">Monthly Fee</p>
                                      <p className="text-base font-medium text-gray-900">₹{student.monthlyFee || '-'}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Personal Information Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-base font-medium text-gray-900">{student.name}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Father's/Husband's Name</p>
                                <p className="text-base font-medium text-gray-900">{student.fatherName || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="text-base font-medium text-gray-900">{student.dob ? format(new Date(student.dob), "MMMM do, yyyy") : '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="text-base font-medium text-gray-900">{student.gender || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Academic Information Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Seat Number</p>
                                <p className="text-base font-medium text-gray-900">{student.seatNo || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Admission Date</p>
                                <p className="text-base font-medium text-gray-900">{student.admissionDate ? format(new Date(student.admissionDate), "MMMM do, yyyy") : '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Course</p>
                                <p className="text-base font-medium text-gray-900">{student.course || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Shift</p>
                                <p className="text-base font-medium text-gray-900 pl-0">{student.shift || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Contact Information Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="text-base font-medium text-gray-900">{student.email || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="text-base font-medium text-gray-900">{student.phone || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">WhatsApp Number</p>
                                <p className="text-base font-medium text-gray-900">{student.whatsapp || '-'}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="text-base font-medium text-gray-900">{student.address || '-'}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">City</p>
                                <p className="text-base font-medium text-gray-900">{student.city || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">State</p>
                                <p className="text-base font-medium text-gray-900">{student.state || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Pincode</p>
                                <p className="text-base font-medium text-gray-900">{student.pincode || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* ID Proof Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">ID Proof</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">ID Proof Type</p>
                                <p className="text-base font-medium text-gray-900">{student.idProofType || '-'}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">ID Proof Number</p>
                                <p className="text-base font-medium text-gray-900">{student.idProofNumber || '-'}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">ID Proof Front</p>
                                <div className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                                  <img
                                    src={student.idProofFront || "/placeholder.svg"}
                                    alt="ID Front"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">ID Proof Back</p>
                                <div className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                                  <img
                                    src={student.idProofBack || "/placeholder.svg"}
                                    alt="ID Back"
                                    className="h-full w-full object-cover"
                          />
                        </div>
                              </div>
                            </div>
                          </div>

                          {/* Terms & Conditions Section */}
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Terms & Conditions</h3>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">1. I hereby declare that all the information provided above is true and correct to the best of my knowledge.</p>
                              <p className="text-xs text-gray-500">2. I understand that any false information provided may result in cancellation of my admission.</p>
                              <p className="text-xs text-gray-500">3. I agree to abide by all the rules and regulations of the institution.</p>
                              <p className="text-xs text-gray-500">4. I understand that the institution reserves the right to modify the rules and regulations as deemed necessary.</p>
                            </div>
                          </div>

                          {/* Declaration Section */}
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Declaration</h3>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">I hereby declare that I have read and understood all the terms and conditions mentioned above and agree to abide by them.</p>
                            </div>
                          </div>

                          {/* Signature Section */}
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">Signature</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">Student's Signature</p>
                                <div className="h-16 w-full border-b-2 border-gray-300"></div>
                                <p className="text-xs text-gray-500">Date: {format(new Date(), "dd/MM/yyyy")}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">Authorities Signature & Seal</p>
                                <div className="h-16 w-full border-b-2 border-gray-300"></div>
                                <p className="text-xs text-gray-500">Date: {format(new Date(), "dd/MM/yyyy")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="passbook" className="p-4">
                      <Tabs defaultValue="total-due" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none">
                          <TabsTrigger value="total-due" className="flex items-center gap-2">
                            Total Due <Badge variant="destructive" className="ml-1">₹23,571</Badge>
                          </TabsTrigger>
                          <TabsTrigger value="total-collection" className="flex items-center gap-2">
                            Total Collection <Badge variant="outline" className="ml-1">₹15,000</Badge>
                          </TabsTrigger>
                          <TabsTrigger value="add-dues">Add Dues</TabsTrigger>
                        </TabsList>
                        <TabsContent value="total-due" className="p-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h4 className="font-semibold text-base mb-4">Due Summary</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Total Dues:</span>
                                <span className="font-medium text-red-600">₹23,571</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Last Payment Date:</span>
                                <span className="font-medium text-gray-900">15 Apr 2024</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Next Due Date:</span>
                                <span className="font-medium text-gray-900">15 May 2024</span>
                              </div>
                            </div>
                            <div className="mt-6">
                              <h4 className="font-semibold text-base mb-4">Due Details</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Description</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[
                                    { date: "2024-05-15", amount: 5000, status: "pending", description: "Monthly Fee" },
                                    { date: "2024-04-15", amount: 5000, status: "pending", description: "Monthly Fee" },
                                    { date: "2024-03-15", amount: 5000, status: "pending", description: "Monthly Fee" },
                                    { date: "2024-02-15", amount: 5000, status: "pending", description: "Monthly Fee" },
                                    { date: "2024-01-15", amount: 3571, status: "pending", description: "Monthly Fee" },
                                  ].map((due, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{format(new Date(due.date), "dd MMM yyyy")}</TableCell>
                                      <TableCell>₹{due.amount}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                          {due.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{due.description}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="total-collection" className="p-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h4 className="font-semibold text-base mb-4">Collection History</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Payment Method</TableHead>
                                  <TableHead>Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {[
                                  { date: "2024-04-15", amount: 5000, status: "paid", method: "UPI", description: "Monthly Fee" },
                                  { date: "2024-03-15", amount: 5000, status: "paid", method: "Bank Transfer", description: "Monthly Fee" },
                                  { date: "2024-02-15", amount: 5000, status: "paid", method: "Cash", description: "Monthly Fee" },
                                ].map((payment, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{format(new Date(payment.date), "dd MMM yyyy")}</TableCell>
                                    <TableCell>₹{payment.amount}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        {payment.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                        <TabsContent value="add-dues" className="p-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h4 className="font-semibold text-base mb-4">Add New Dues</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input type="number" placeholder="Enter amount" />
                              </div>
                              <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="date" />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Enter description" />
                              </div>
                              <Button className="w-full">Add Dues</Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t px-4 py-3 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleCardClick = (route: string) => {
    navigate(route);
  };

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
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">STUDENT MANAGEMENT</h1>
                <p className="text-blue-100">Manage student profiles and access</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/30"
                  onClick={handleImportClick}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Student
                    </>
                  )}
                </Button>
                <Button 
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/30"
                  onClick={handleSendNotification}
                  disabled={isSendingNotification}
                >
                  {isSendingNotification ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(card.route)}
            >
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Student Table with Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Manage and view all student records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4 gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search students by name, ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            status.value === 'active' ? 'bg-green-500' :
                            status.value === 'pending' ? 'bg-yellow-500' :
                            status.value === 'suspended' ? 'bg-red-500' :
                            status.value === 'inactive' ? 'bg-gray-500' :
                            status.value === 'graduated' ? 'bg-blue-500' :
                            status.value === 'on_leave' ? 'bg-purple-500' :
                            'bg-gray-300'
                          }`} />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] border-r border-dashed">Photo</TableHead>
                    <TableHead className="w-[120px] border-r border-dashed">Student ID</TableHead>
                    <TableHead className="w-[200px] border-r border-dashed">Name</TableHead>
                    <TableHead className="w-[100px] border-r border-dashed">Seat No</TableHead>
                    <TableHead className="w-[150px] border-r border-dashed">Last Active</TableHead>
                    <TableHead className="w-[150px] border-r border-dashed">Due Date</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStudents.map((student) => (
                    <TableRow 
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="py-3 border-r border-dashed">
                        <div className="flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                            <img
                              src={student.photo || "/placeholder.svg"}
                              alt={student.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 border-r border-dashed">{student.id}</TableCell>
                      <TableCell className="py-3 border-r border-dashed">{student.name}</TableCell>
                      <TableCell className="py-3 border-r border-dashed">{student.seatNo || '-'}</TableCell>
                      <TableCell className="py-3 border-r border-dashed">{student.lastActive}</TableCell>
                      <TableCell className="py-3 border-r border-dashed">
                        {student.dueDate ? format(new Date(student.dueDate), "MMM dd, yyyy") : '-'}
                      </TableCell>
                      <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => setSelectedStudent(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <StudentDetailsModal />
        <PhotoModal />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
