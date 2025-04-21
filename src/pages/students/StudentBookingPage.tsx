import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, Calendar, Clock, User, Building2, ArrowLeft, Pencil, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data for bookings
const mockBookings = [
  {
    id: "BK001",
    studentName: "John Doe",
    property: "Property A",
    seatNo: "A101",
    bookingType: "long",
    bookingDate: "2024-03-01",
    moveInDate: "2024-03-15",
    shift: "Morning",
    fee: 5000,
    collection: 2500,
  },
  {
    id: "BK002",
    studentName: "Jane Smith",
    property: "Property B",
    seatNo: "B202",
    bookingType: "short",
    bookingDate: "2024-03-05",
    moveInDate: "2024-03-20",
    shift: "Evening",
    fee: 3000,
    collection: 1500,
  },
  {
    id: "BK003",
    studentName: "Mike Johnson",
    property: "Property C",
    seatNo: "C301",
    bookingType: "long",
    bookingDate: "2024-03-10",
    moveInDate: "2024-03-25",
    shift: "Afternoon",
    fee: 4500,
    collection: 2250,
  },
];

const StudentBookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState(mockBookings);

  // Filter bookings based on search term and status
  const filteredBookings = React.useMemo(() => {
    return mockBookings.filter(booking => {
      const matchesSearch = 
        booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.seatNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.bookingType === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleEdit = (id: string) => {
    navigate(`/students/booking/edit/${id}`);
  };

  const handleDelete = async (bookingId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold">Student Bookings</h1>
              <p className="text-muted-foreground">
                Manage and track student seat bookings
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/students/booking/add')}>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>
              View and manage all student seat bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bookings Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="border-r">Student Name</TableHead>
                      <TableHead className="border-r">Property</TableHead>
                      <TableHead className="border-r">Seat No</TableHead>
                      <TableHead className="border-r">Booking Type</TableHead>
                      <TableHead className="border-r">Booking Date</TableHead>
                      <TableHead className="border-r">Move In Date</TableHead>
                      <TableHead className="border-r">Shift</TableHead>
                      <TableHead className="border-r">Fee</TableHead>
                      <TableHead className="border-r">Collection</TableHead>
                      <TableHead className="border-l-2 border-primary bg-primary/5 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-muted/50">
                          <TableCell className="border-r">{booking.studentName}</TableCell>
                          <TableCell className="border-r">{booking.property}</TableCell>
                          <TableCell className="border-r">{booking.seatNo}</TableCell>
                          <TableCell className="border-r">
                            <Badge variant={booking.bookingType === "long" ? "default" : "secondary"}>
                              {booking.bookingType}
                            </Badge>
                          </TableCell>
                          <TableCell className="border-r">{format(new Date(booking.bookingDate), "PPP")}</TableCell>
                          <TableCell className="border-r">{format(new Date(booking.moveInDate), "PPP")}</TableCell>
                          <TableCell className="border-r">{booking.shift}</TableCell>
                          <TableCell className="border-r">₹{booking.fee}</TableCell>
                          <TableCell className="border-r">₹{booking.collection}</TableCell>
                          <TableCell className="border-l-2 border-primary bg-primary/5">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(booking.id)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the booking
                                      and remove the data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(booking.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentBookingPage; 