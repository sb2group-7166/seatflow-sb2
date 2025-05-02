import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sofa, IndianRupee, Clock, TrendingUp, ChevronRight, BookOpen, Activity, Filter, BarChart2, LineChart, PieChart, Download, Plus, Bookmark, UserPlus, CreditCard, Search, AlertCircle, Loader2, Phone, Calendar, FileText, User, X, Building2, Library, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { format, subDays } from 'date-fns';
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
import QuickCollection from '@/components/financial/payments/QuickCollection';
import { properties } from "@/data/properties";

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

// Mock data for different properties
const propertyData = {
  sb2: {
    totalSeats: 98,
    bookedSeats: 45,
    activeStudents: 120,
    todayRevenue: 2500,
    monthlyRevenue: 75000,
    averageOccupancy: '65%',
    peakHours: '2:00 PM - 4:00 PM',
    popularZones: ['Reading Area', 'Computer Zone'],
    studentGrowth: '+12%',
    revenueGrowth: '+8%',
    todayBookings: 15,
    todayNewStudents: 3,
    todayActiveStudents: 85,
    todayCancellations: 2,
    todayRefunds: 1,
    todayPayments: 18,
    todayAverageStay: '2.5 hours',
    todayPopularSeats: ['A1', 'B3', 'C5'],
    todayBusiestHour: '3:00 PM',
    todayQuietestHour: '11:00 AM'
  },
  sb1: {
    totalSeats: 75,
    bookedSeats: 35,
    activeStudents: 90,
    todayRevenue: 1800,
    monthlyRevenue: 55000,
    averageOccupancy: '47%',
    peakHours: '1:00 PM - 3:00 PM',
    popularZones: ['Study Area', 'Group Zone'],
    studentGrowth: '+8%',
    revenueGrowth: '+5%',
    todayBookings: 12,
    todayNewStudents: 2,
    todayActiveStudents: 65,
    todayCancellations: 1,
    todayRefunds: 0,
    todayPayments: 14,
    todayAverageStay: '2.0 hours',
    todayPopularSeats: ['B2', 'C4', 'D1'],
    todayBusiestHour: '2:00 PM',
    todayQuietestHour: '10:00 AM'
  },
  main: {
    totalSeats: 120,
    bookedSeats: 60,
    activeStudents: 150,
    todayRevenue: 3200,
    monthlyRevenue: 95000,
    averageOccupancy: '50%',
    peakHours: '3:00 PM - 5:00 PM',
    popularZones: ['Main Hall', 'Quiet Zone'],
    studentGrowth: '+15%',
    revenueGrowth: '+10%',
    todayBookings: 20,
    todayNewStudents: 5,
    todayActiveStudents: 100,
    todayCancellations: 3,
    todayRefunds: 2,
    todayPayments: 22,
    todayAverageStay: '3.0 hours',
    todayPopularSeats: ['M1', 'M2', 'M3'],
    todayBusiestHour: '4:00 PM',
    todayQuietestHour: '9:00 AM'
  }
};

const propertyNames = {
  sb2: "SB2 Library",
  sb1: "SB1 Library",
  main: "Main Library"
};

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

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState("sb2");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState(propertyData.sb2);

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setStats(propertyData[propertyId as keyof typeof propertyData]);
  };

  // Background data fetching
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isLoading) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update stats based on selected property
        if (isMounted) {
          setStats(propertyData[selectedProperty as keyof typeof propertyData]);
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
  }, [selectedProperty]);

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

  const handleQuickBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
  };

  const handleAddStudent = () => {
    navigate('/students/add');
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
          </div>

          {/* Quick Actions - Priority Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card className="h-full cursor-pointer border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300"
                onClick={handleQuickBooking}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
                      <Bookmark className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">Quick Booking</h3>
                      <p className="text-sm text-blue-600">Book a seat instantly</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-blue-600">Click to proceed</span>
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card className="h-full cursor-pointer border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 transition-all duration-300"
                onClick={handleAddStudent}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shadow-inner">
                      <UserPlus className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-green-900">Add Student</h3>
                      <p className="text-sm text-green-600">Register new student</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-green-600">Click to proceed</span>
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card className="h-full cursor-pointer border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300"
                onClick={handleProcessPayment}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center shadow-inner">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-purple-900">Quick Collection</h3>
                      <p className="text-sm text-purple-600">Collect payment & generate receipt</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-purple-600">Click to proceed</span>
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Key Metrics - Priority Section */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {cardData.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card 
                  className={`h-full border-none shadow-lg bg-gradient-to-br ${card.color} text-white cursor-pointer hover:shadow-xl transition-all duration-300`}
                  onClick={() => handleCardClick(card.route)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      {card.title}
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                      <card.icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{card.value}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/80">
                        Click to view details
                      </p>
                      <ChevronRight className="h-5 w-5 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Today's Overview Card */}
          <Card className="col-span-2 border-none shadow-lg">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Today's Overview
                  </CardTitle>
                  <CardDescription className="mt-1">Comprehensive overview of today's activities</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Last updated:</span>
                  <span className="text-sm font-medium">{format(new Date(), 'hh:mm a')}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Occupancy Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Sofa className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold">Occupancy</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600">Current Occupancy</span>
                        <span className="text-2xl font-bold text-blue-700">{stats.averageOccupancy}</span>
                      </div>
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: stats.averageOccupancy }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">Peak Hours</span>
                        </div>
                        <span className="text-sm">{stats.peakHours}</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Bookmark className="h-4 w-4 text-purple-500" />
                          <span className="text-xs font-medium">Today's Bookings</span>
                        </div>
                        <span className="text-sm font-medium">{stats.todayBookings}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-medium">Avg. Stay Time</span>
                      </div>
                      <span className="text-sm">{stats.todayAverageStay}</span>
                    </div>
                  </div>
                </div>

                {/* Student Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-sm font-semibold">Students</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-600">Active Students</span>
                        <span className="text-2xl font-bold text-green-700">{stats.todayActiveStudents}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600">+{stats.todayNewStudents} new today</span>
                        <span className="text-xs text-red-600">-{stats.todayCancellations} cancellations</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <UserPlus className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">New Students</span>
                        </div>
                        <span className="text-sm font-medium">{stats.todayNewStudents}</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-xs font-medium">Cancellations</span>
                        </div>
                        <span className="text-sm font-medium">{stats.todayCancellations}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs font-medium">Refunds</span>
                      </div>
                      <span className="text-sm font-medium">{stats.todayRefunds}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-semibold">Financial</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-600">Today's Revenue</span>
                        <span className="text-2xl font-bold text-purple-700">₹{stats.todayRevenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-600">{stats.todayPayments} payments</span>
                        <span className="text-xs text-green-500">{stats.revenueGrowth} growth</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">Total Payments</span>
                        </div>
                        <span className="text-sm font-medium">{stats.todayPayments}</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="text-xs font-medium">Monthly Revenue</span>
                        </div>
                        <span className="text-sm">₹{stats.monthlyRevenue}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium">Revenue Growth</span>
                      </div>
                      <span className="text-sm text-green-500">{stats.revenueGrowth}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  <h4 className="text-sm font-medium mb-3">Popular Seats Today</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.todayPopularSeats.map((seat, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  <h4 className="text-sm font-medium mb-3">Peak Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium">Busiest Hour</span>
                      </div>
                      <span className="text-sm font-medium">{stats.todayBusiestHour}</span>
                    </div>
                    <div className="p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium">Quietest Hour</span>
                      </div>
                      <span className="text-sm font-medium">{stats.todayQuietestHour}</span>
                    </div>
                  </div>
                </div>
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
              <QuickCollection onClose={() => setShowPaymentForm(false)} />
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
                      <div className="space-y-4">
                        {selectedCard && cardData.find(card => card.id === selectedCard)?.details.content.map((item, index) => (
                          <div key={index} className="grid grid-cols-4 items-center gap-4">
                            <div className="col-span-1 text-sm font-medium">{item.label}</div>
                            <div className="col-span-3 text-sm">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Analytics data will be available soon.</p>
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