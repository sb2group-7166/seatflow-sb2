import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ArrowLeft, Users, AlertCircle, UserCheck, Phone, Calendar, Building2, GraduationCap, Loader2, UserX, Clock, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const OldStudentsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Mock student data for old students
  const oldStudentsData = [
    {
      id: "STU2001",
      name: "Robert Wilson",
      email: "rwilson@example.edu",
      registeredOn: "2022-05-10",
      status: "selected",
      lastActive: "3 months ago",
      photo: "/placeholder.svg",
      idProof: "ID22345",
      bookings: 120,
      violations: 2,
      phone: "+1 555-111-2222",
      address: "789 Alumni Lane, Graduation District",
      priority: "high",
      notes: "Selected for special program. Regular contributor to alumni events.",
      seatNo: "N/A",
      admissionDate: "2022-05-01",
      graduationDate: "2023-05-15"
    },
    {
      id: "STU2002",
      name: "Emily Davis",
      email: "edavis@example.edu",
      registeredOn: "2022-03-22",
      status: "inactive",
      lastActive: "6 months ago",
      photo: "/placeholder.svg",
      idProof: "ID22346",
      bookings: 85,
      violations: 1,
      phone: "+1 555-333-4444",
      address: "456 Past Student Ave, Inactive Zone",
      priority: "medium",
      notes: "Inactive due to relocation. May return for postgraduate studies.",
      seatNo: "N/A",
      admissionDate: "2022-03-15",
      lastActiveDate: "2023-01-10"
    },
    {
      id: "STU2003",
      name: "James Thompson",
      email: "jthompson@example.edu",
      registeredOn: "2021-09-05",
      status: "selected",
      lastActive: "1 year ago",
      photo: "/placeholder.svg",
      idProof: "ID22347",
      bookings: 150,
      violations: 0,
      phone: "+1 555-555-6666",
      address: "321 Graduate Blvd, Alumni Complex",
      priority: "high",
      notes: "Selected for advanced program. Now working at a top tech company.",
      seatNo: "N/A",
      admissionDate: "2021-09-01",
      graduationDate: "2022-12-20"
    },
    {
      id: "STU2004",
      name: "Sarah Chen",
      email: "schen@example.edu",
      registeredOn: "2022-01-30",
      status: "inactive",
      lastActive: "8 months ago",
      photo: "/placeholder.svg",
      idProof: "ID22348",
      bookings: 65,
      violations: 0,
      phone: "+1 555-777-8888",
      address: "654 Former Student Rd, Inactive Area",
      priority: "medium",
      notes: "Inactive due to study abroad program. Expected to return next semester.",
      seatNo: "N/A",
      admissionDate: "2022-01-15",
      lastActiveDate: "2022-10-05"
    },
    {
      id: "STU2005",
      name: "David Rodriguez",
      email: "drodriguez@example.edu",
      registeredOn: "2021-11-02",
      status: "selected",
      lastActive: "2 months ago",
      photo: "/placeholder.svg",
      idProof: "ID22349",
      bookings: 110,
      violations: 1,
      phone: "+1 555-999-0000",
      address: "987 Alumni Way, Graduation District",
      priority: "high",
      notes: "Selected for special program. Now pursuing a master's degree at another institution.",
      seatNo: "N/A",
      admissionDate: "2021-11-01",
      graduationDate: "2023-03-10"
    }
  ];

  // Status types for old students
  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'selected', label: 'Selected' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' }
  ];

  // Filter students based on search term and status
  const filteredStudents = React.useMemo(() => {
    let filtered = [...oldStudentsData];
    
    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "selected") {
        // Get current date and date from one week ago
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        filtered = filtered.filter(student => {
          const evictionDate = new Date(student.graduationDate);
          return evictionDate >= oneWeekAgo && evictionDate <= currentDate;
        });
      } else if (statusFilter === "inactive") {
        // Get current date and date from one month ago
        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        filtered = filtered.filter(student => {
          const evictionDate = new Date(student.lastActiveDate);
          return evictionDate >= oneMonthAgo && evictionDate <= currentDate;
        });
      } else {
        filtered = filtered.filter(student => student.status === statusFilter);
      }
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
  }, [oldStudentsData, statusFilter, searchTerm]);

  // Calculate statistics
  const totalOldStudents = oldStudentsData.length;
  const selectedStudents = oldStudentsData.filter(student => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const evictionDate = new Date(student.graduationDate);
    return evictionDate >= oneWeekAgo && evictionDate <= currentDate;
  }).length;
  const inactiveStudents = oldStudentsData.filter(student => {
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const evictionDate = new Date(student.lastActiveDate);
    return evictionDate >= oneMonthAgo && evictionDate <= currentDate;
  }).length;

  // Simulate API call to fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStudents(oldStudentsData);
      } catch (error) {
        console.error('Error fetching old students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch old students",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Export Successful",
        description: "Old student data has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewStudent = (studentId: string) => {
    // Navigate to student details page
    navigate(`/students/${studentId}`);
  };

  const handleRowClick = (studentId: string) => {
    handleViewStudent(studentId);
  };

  const handleBackToActive = async (studentId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Student has been moved back to active status",
      });
      
      // In a real application, you would update the student's status in the database
      // and refresh the student list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move student back to active status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      selected: "default",
      inactive: "secondary",
      on_leave: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/students')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Old Students</h1>
            <p className="text-muted-foreground">
              View and manage records of graduated and inactive students
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="cursor-pointer" onClick={() => setStatusFilter("all")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Old Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOldStudents}</div>
                <p className="text-xs text-muted-foreground">
                  All old student records
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="cursor-pointer" onClick={() => setStatusFilter("selected")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Week Eviction</CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{selectedStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Students evicted in the last week
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="cursor-pointer" onClick={() => setStatusFilter("inactive")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Month Eviction</CardTitle>
                <UserX className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{inactiveStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Students evicted in the last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Bar - Search and Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search old students by name, ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
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
                        status.value === 'selected' ? 'bg-blue-500' :
                        status.value === 'inactive' ? 'bg-amber-500' :
                        status.value === 'on_leave' ? 'bg-purple-500' :
                        'bg-gray-300'
                      }`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <CardTitle>Old Students</CardTitle>
            <CardDescription>
              {filteredStudents.length} old students found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] border-r border-dashed">Photo</TableHead>
                      <TableHead className="w-[120px] border-r border-dashed">Student ID</TableHead>
                      <TableHead className="w-[200px] border-r border-dashed">Name</TableHead>
                      <TableHead className="w-[120px] border-r border-dashed">Status</TableHead>
                      <TableHead className="w-[120px] border-r border-dashed">Admission Date</TableHead>
                      <TableHead className="w-[120px] border-r border-dashed">Eviction Date</TableHead>
                      <TableHead className="w-[120px] border-r border-dashed">Last Active</TableHead>
                      <TableHead className="w-[150px] bg-muted/50">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow 
                        key={student.id} 
                        onClick={() => handleViewStudent(student.id)}
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
                        <TableCell className="py-3 border-r border-dashed">
                          {getStatusBadge(student.status)}
                        </TableCell>
                        <TableCell className="py-3 border-r border-dashed">{student.admissionDate}</TableCell>
                        <TableCell className="py-3 border-r border-dashed">
                          {student.status === 'selected' ? student.graduationDate : 
                           student.status === 'inactive' ? student.lastActiveDate : 
                           'N/A'}
                        </TableCell>
                        <TableCell className="py-3 border-r border-dashed">{student.lastActive}</TableCell>
                        <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleBackToActive(student.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Back to Active
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OldStudentsPage; 