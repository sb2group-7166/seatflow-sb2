import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sofa, IndianRupee, Clock, TrendingUp, ChevronRight, BookOpen, Activity, Filter, BarChart2, LineChart, PieChart, Download, Plus, Bookmark, UserPlus, CreditCard, Search, AlertCircle, Loader2, Phone, Calendar, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import QuickBookingForm from '@/components/booking/QuickBookingForm';
import { PaymentForm } from '@/components/financial/payments/PaymentForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// API Integration Types
interface Booking {
  id: string;
  studentId: string;
  seatId: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface Student {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  lastActive: string;
}

interface Revenue {
  amount: number;
  date: string;
  type: 'booking' | 'membership' | 'other';
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
            {this.state.error && <div className="mt-2 text-xs">{this.state.error.message}</div>}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Data Validation Types
interface ChartData {
  date: string;
  occupancy: number;
  revenue: number;
  students: number;
}

interface ZoneData {
  name: string;
  value: number;
}

// Data Validation Functions
const validateChartData = (data: ChartData[]): boolean => {
  return data.every(item => 
    typeof item.date === 'string' &&
    typeof item.occupancy === 'number' && item.occupancy >= 0 && item.occupancy <= 100 &&
    typeof item.revenue === 'number' && item.revenue >= 0 &&
    typeof item.students === 'number' && item.students >= 0
  );
};

const validateZoneData = (data: ZoneData[]): boolean => {
  return data.every(item => 
    typeof item.name === 'string' &&
    typeof item.value === 'number' && item.value >= 0
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedZone, setSelectedZone] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [stats, setStats] = useState({
    totalSeats: 98,
    bookedSeats: 45,
    activeStudents: 120,
    todayRevenue: 2500,
    monthlyRevenue: 75000,
    averageOccupancy: '65%',
    peakHours: '2:00 PM - 4:00 PM',
    popularZones: ['Reading Area', 'Computer Zone'],
    studentGrowth: '+12%',
    revenueGrowth: '+8%'
  });

  const [occupancyData, setOccupancyData] = useState<ChartData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);

  const [studentData, setStudentData] = useState({
    fullName: '',
    fatherName: '',
    studentId: generateStudentId(),
    shift: '',
    email: '',
    phoneNumber: '',
    admissionDate: new Date(),
    address: '',
    idProofFront: null as File | null,
    idProofBack: null as File | null,
    profilePhoto: null as File | null,
    guardianType: 'father',
    guardianName: ''
  });

  // Function to generate student ID
  function generateStudentId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ST${year}${month}${random}`;
  }

  // Background data fetching
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isLoading) return; // Prevent multiple simultaneous fetches
      
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock API response with validation
        const newStats = {
          ...stats,
          bookedSeats: Math.floor(Math.random() * 30) + 40,
          activeStudents: Math.floor(Math.random() * 20) + 100,
          todayRevenue: Math.floor(Math.random() * 2000) + 1000
        };

        const newOccupancyData = Array.from({ length: 7 }, (_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'MMM dd'),
          occupancy: Math.floor(Math.random() * 30) + 40,
          revenue: Math.floor(Math.random() * 2000) + 1000,
          students: Math.floor(Math.random() * 20) + 80
        }));

        const newZoneData = [
          { name: 'Reading Area', value: Math.floor(Math.random() * 20) + 20 },
          { name: 'Computer Zone', value: Math.floor(Math.random() * 20) + 20 },
          { name: 'Quiet Study', value: Math.floor(Math.random() * 20) + 20 },
          { name: 'Group Study', value: Math.floor(Math.random() * 20) + 20 }
        ];

        if (isMounted) {
          setStats(newStats);
          setOccupancyData(newOccupancyData);
          setZoneData(newZoneData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for background updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const cardData = [
    {
      id: 'seats',
      title: 'Seat Management',
      value: `${stats.bookedSeats}/${stats.totalSeats}`,
      icon: Sofa,
      color: 'from-blue-500 to-blue-600',
      route: '/seats',
      details: {
        title: 'Seat Analytics',
        content: [
          { label: 'Total Capacity', value: stats.totalSeats },
          { label: 'Booked Seats', value: stats.bookedSeats },
          { label: 'Available Seats', value: stats.totalSeats - stats.bookedSeats },
          { label: 'Occupancy Rate', value: stats.averageOccupancy }
        ]
      }
    },
    {
      id: 'shifts',
      title: 'Shift Management',
      value: '2 Active',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      route: '/shifts',
      details: {
        title: 'Shift Analytics',
        content: [
          { label: 'Morning Shift', value: '07:00 AM - 02:00 PM' },
          { label: 'Evening Shift', value: '02:00 PM - 10:00 PM' },
          { label: 'Total Shifts', value: '2' },
          { label: 'Active Now', value: 'Evening Shift' }
        ]
      }
    },
    {
      id: 'students',
      title: 'Students',
      value: stats.activeStudents.toString(),
      icon: Users,
      color: 'from-green-500 to-green-600',
      route: '/students',
      details: {
        title: 'Student Analytics',
        content: [
          { label: 'Total Students', value: stats.activeStudents },
          { label: 'Growth Rate', value: stats.studentGrowth },
          { label: 'Active Today', value: Math.floor(stats.activeStudents * 0.8) },
          { label: 'New This Month', value: Math.floor(stats.activeStudents * 0.1) }
        ]
      }
    },
    {
      id: 'revenue',
      title: 'Today\'s Revenue',
      value: `₹${stats.todayRevenue}`,
      icon: IndianRupee,
      color: 'from-yellow-500 to-yellow-600',
      route: '/payments',
      details: {
        title: 'Revenue Analytics',
        content: [
          { label: 'Today\'s Revenue', value: `₹${stats.todayRevenue}` },
          { label: 'Monthly Revenue', value: `₹${stats.monthlyRevenue}` },
          { label: 'Growth Rate', value: stats.revenueGrowth },
          { label: 'Average Daily', value: `₹${Math.floor(stats.monthlyRevenue / 30)}` }
        ]
      }
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleCardDoubleClick = (route: string) => {
    navigate(route);
  };

  const handleQuickBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
  };

  const handleAddStudent = () => {
    setShowStudentForm(true);
    // Generate new student ID when opening the form
    setStudentData(prev => ({
      ...prev,
      studentId: generateStudentId()
    }));
  };

  const handleStudentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to save the student data
      // For now, we'll just show a success message
      toast.success('Student added successfully!');
      setShowStudentForm(false);
      setStudentData({
        fullName: '',
        fatherName: '',
        studentId: generateStudentId(), // Generate new ID for next form
        shift: '',
        email: '',
        phoneNumber: '',
        admissionDate: new Date(),
        address: '',
        idProofFront: null,
        idProofBack: null,
        profilePhoto: null,
        guardianType: 'father',
        guardianName: ''
      });
    } catch (error) {
      toast.error('Failed to add student. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'idProofFront' | 'idProofBack' | 'profilePhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'profilePhoto' && !file.type.startsWith('image/')) {
        toast.error('Please upload an image file for profile photo');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      setStudentData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleProcessPayment = () => {
    setShowPaymentForm(true);
  };

  // Loading Skeleton Component
  const MetricCardSkeleton = () => (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-4 w-[80px]" />
      </CardContent>
    </Card>
  );

  // Error Display Component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  // Replace the zone distribution chart with shift data
  const renderShiftCard = () => (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Current Shifts</CardTitle>
        <CardDescription>Active shifts and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <div>
              <h4 className="font-medium">Morning Shift</h4>
              <p className="text-sm text-muted-foreground">07:00 AM - 02:00 PM</p>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-green-500">Completed</span>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <div>
              <h4 className="font-medium">Evening Shift</h4>
              <p className="text-sm text-muted-foreground">02:00 PM - 10:00 PM</p>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-blue-500">Active</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/shifts')}
        >
          View All Shifts
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <ErrorBoundary>
      <div className="space-y-6">
          {error && <ErrorDisplay message={error} />}

          {/* Top Bar - Search and Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings, students, or payments..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Quick Actions - Priority Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors border-2 border-blue-200" onClick={handleQuickBooking}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bookmark className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Quick Booking</h3>
                      <p className="text-sm text-muted-foreground">Book a seat instantly</p>
                    </div>
                  </div>
                  <Plus className="h-6 w-6 text-blue-600" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer bg-green-50 hover:bg-green-100 transition-colors border-2 border-green-200" onClick={handleAddStudent}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Add Student</h3>
                      <p className="text-sm text-muted-foreground">Register new student</p>
                    </div>
                  </div>
                  <Plus className="h-6 w-6 text-green-600" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors border-2 border-purple-200" onClick={handleProcessPayment}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Process Payment</h3>
                      <p className="text-sm text-muted-foreground">Handle payments</p>
                    </div>
                  </div>
                  <Plus className="h-6 w-6 text-purple-600" />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Key Metrics - Priority Section */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`bg-gradient-to-br ${card.color} text-white cursor-pointer`}
                  onClick={() => handleCardClick(card.route)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-white/80">
                      Click to view
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Occupancy Trend</CardTitle>
                <CardDescription>Last 7 days occupancy rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={occupancyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="occupancy" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {renderShiftCard()}
          </div>

          {/* Main Chart - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle>Occupancy & Revenue Trends</CardTitle>
              <CardDescription>Last 7 days occupancy and revenue data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={occupancyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area yAxisId="left" type="monotone" dataKey="occupancy" stroke="#3b82f6" fill="#93c5fd" name="Occupancy %" />
                      <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#c4b5fd" name="Revenue (₹)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Booking Dialog */}
          <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
            <DialogContent className="sm:max-w-[600px]">
              <QuickBookingForm onClose={handleBookingFormClose} />
            </DialogContent>
          </Dialog>

          {/* Payment Form Dialog */}
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogContent className="max-w-2xl">
              <PaymentForm onClose={() => setShowPaymentForm(false)} />
            </DialogContent>
          </Dialog>

          {/* Student Form Dialog */}
          <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Add New Student
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Fill in the student details below</p>
              </DialogHeader>
              <form onSubmit={handleStudentFormSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="fullName"
                        placeholder="Enter student's full name"
                        value={studentData.fullName}
                        onChange={(e) => setStudentData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianName" className="text-sm font-medium">Father's/Husband's Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="guardianName"
                        placeholder="Enter father's/husband's name"
                        value={studentData.guardianName}
                        onChange={(e) => setStudentData(prev => ({ ...prev, guardianName: e.target.value }))}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Academic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-sm font-medium">Student ID <span className="text-red-500">*</span></Label>
                      <Input
                        id="studentId"
                        placeholder="Enter student ID"
                        value={studentData.studentId}
                        onChange={(e) => setStudentData(prev => ({ ...prev, studentId: e.target.value }))}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift" className="text-sm font-medium">Shift <span className="text-red-500">*</span></Label>
                      <Select
                        value={studentData.shift}
                        onValueChange={(value) => setStudentData(prev => ({ ...prev, shift: value }))}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (07:00 AM - 02:00 PM)</SelectItem>
                          <SelectItem value="evening">Evening (02:00 PM - 10:00 PM)</SelectItem>
                          <SelectItem value="lateEvening">Late Evening (02:00 PM - 12:00 AM)</SelectItem>
                          <SelectItem value="fullDay1">Full Day (07:00 AM - 10:00 PM)</SelectItem>
                          <SelectItem value="fullDay2">Full Day (07:00 AM - 12:00 AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={studentData.email}
                        onChange={(e) => setStudentData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter phone number"
                        value={studentData.phoneNumber}
                        onChange={(e) => setStudentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium">Address <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address"
                        value={studentData.address}
                        onChange={(e) => setStudentData(prev => ({ ...prev, address: e.target.value }))}
                        required
                        className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Admission Details Section */}
                <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Admission Details</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Admission Date <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      value={studentData.admissionDate ? format(studentData.admissionDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : new Date();
                        setStudentData(prev => ({ ...prev, admissionDate: date }));
                      }}
                      required
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Required Documents</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idProofFront" className="text-sm font-medium">ID Proof (Front Side) <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="idProofFront"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'idProofFront')}
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                        {studentData.idProofFront && (
                          <span className="text-sm text-green-600">✓ Uploaded</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idProofBack" className="text-sm font-medium">ID Proof (Back Side) <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="idProofBack"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'idProofBack')}
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                        {studentData.idProofBack && (
                          <span className="text-sm text-green-600">✓ Uploaded</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profilePhoto" className="text-sm font-medium">Profile Photo <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                        {studentData.profilePhoto && (
                          <span className="text-sm text-green-600">✓ Uploaded</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowStudentForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Student
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Details Dialog */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {cardData.find(card => card.id === selectedCard)?.details.title}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          {selectedCard && cardData.find(card => card.id === selectedCard)?.details.content.map((item, index) => (
                            <div key={index} className="grid grid-cols-4 items-center gap-4">
                              <div className="col-span-1 text-sm font-medium">{item.label}</div>
                              <div className="col-span-3 text-sm">{item.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="h-[300px]">
                          {selectedCard && cardData.find(card => card.id === selectedCard)?.details.chart}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="h-[300px]">
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      selectedCard && cardData.find(card => card.id === selectedCard)?.details.chart
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="actions">
                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Activity className="mr-2 h-4 w-4" />
                      Schedule Analysis
                    </Button>
              </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => selectedCard && navigate(cardData.find(card => card.id === selectedCard)?.route || '/')}>
                  View Full Page
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default DashboardPage;
