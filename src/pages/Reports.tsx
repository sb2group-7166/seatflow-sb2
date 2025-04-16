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
import {
  BarChart,
  Calendar,
  Download,
  FileText,
  Filter,
  Printer,
  Share2,
  ChevronDown,
  ArrowUpDown,
  Clock,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for occupancy by zone
const zoneOccupancy = [
  {
    zone: "Reading Area",
    totalSeats: 24,
    avgOccupancy: 71,
    peakHour: "2:00 PM",
    utilization: 76
  },
  {
    zone: "Computer Zone",
    totalSeats: 18,
    avgOccupancy: 82,
    peakHour: "11:00 AM",
    utilization: 88
  },
  {
    zone: "Quiet Study",
    totalSeats: 16,
    avgOccupancy: 65,
    peakHour: "3:00 PM",
    utilization: 70
  },
  {
    zone: "Group Study",
    totalSeats: 12,
    avgOccupancy: 58,
    peakHour: "4:00 PM",
    utilization: 62
  }
];

// Mock data for student activity
const studentActivity = [
  {
    studentId: "STU1001",
    name: "Alex Johnson",
    totalHours: 42,
    bookings: 15,
    noShows: 0,
    avgDuration: "2.8 hrs"
  },
  {
    studentId: "STU1002",
    name: "Samantha Lee",
    totalHours: 36,
    bookings: 12,
    noShows: 1,
    avgDuration: "3.0 hrs"
  },
  {
    studentId: "STU1003",
    name: "David Martinez",
    totalHours: 28,
    bookings: 10,
    noShows: 2,
    avgDuration: "2.8 hrs"
  },
  {
    studentId: "STU1004",
    name: "Priya Patel",
    totalHours: 54,
    bookings: 18,
    noShows: 0,
    avgDuration: "3.0 hrs"
  },
  {
    studentId: "STU1005",
    name: "Michael Wong",
    totalHours: 33,
    bookings: 11,
    noShows: 1,
    avgDuration: "3.0 hrs"
  }
];

// Mock data for financial reports
const financialData = [
  {
    month: "January",
    totalRevenue: "₹45,000",
    seatBookings: "₹32,000",
    lateFees: "₹5,000",
    membership: "₹8,000",
    growth: "+12%"
  },
  {
    month: "February",
    totalRevenue: "₹48,500",
    seatBookings: "₹34,000",
    lateFees: "₹6,500",
    membership: "₹8,000",
    growth: "+8%"
  },
  {
    month: "March",
    totalRevenue: "₹52,000",
    seatBookings: "₹36,000",
    lateFees: "₹8,000",
    membership: "₹8,000",
    growth: "+7%"
  },
  {
    month: "April",
    totalRevenue: "₹55,500",
    seatBookings: "₹38,000",
    lateFees: "₹9,500",
    membership: "₹8,000",
    growth: "+7%"
  }
];

// Mock data for payment history
const paymentHistory = [
  {
    id: "PAY1001",
    studentId: "STU1001",
    studentName: "Alex Johnson",
    amount: "₹1,200",
    type: "Seat Booking",
    date: "2024-03-15",
    status: "Completed"
  },
  {
    id: "PAY1002",
    studentId: "STU1002",
    studentName: "Samantha Lee",
    amount: "₹800",
    type: "Late Fee",
    date: "2024-03-14",
    status: "Completed"
  },
  {
    id: "PAY1003",
    studentId: "STU1003",
    studentName: "David Martinez",
    amount: "₹2,000",
    type: "Membership",
    date: "2024-03-13",
    status: "Completed"
  },
  {
    id: "PAY1004",
    studentId: "STU1004",
    studentName: "Priya Patel",
    amount: "₹1,500",
    type: "Seat Booking",
    date: "2024-03-12",
    status: "Pending"
  },
  {
    id: "PAY1005",
    studentId: "STU1005",
    studentName: "Michael Wong",
    amount: "₹900",
    type: "Late Fee",
    date: "2024-03-11",
    status: "Completed"
  }
];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("7days");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View analytics and generate reports for library operations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
          <div>
            <h2 className="text-lg font-medium">Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Data for {dateRange === "7days" ? "Last 7 Days" : 
                        dateRange === "30days" ? "Last 30 Days" : 
                        dateRange === "90days" ? "Last 90 Days" : "Custom Range"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              defaultValue={dateRange}
              onValueChange={(value) => setDateRange(value)}
            >
              <SelectTrigger className="w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full sm:w-[500px] grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seat Occupancy</CardTitle>
                  <CardDescription>
                    Occupancy trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <OccupancyChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    Revenue breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>
                  Busiest times of day across all zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="relative h-full w-full">
                    {/* Placeholder for a time-based chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Clock className="h-16 w-16 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Peak hours chart would be displayed here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium mr-2">Peak Hours:</span> 10AM-2PM
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Available Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Weekly Occupancy Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Monthly Revenue Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Student Usage Analytics</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Zone Performance Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Insights</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Daily Occupancy</span>
                      <span className="font-medium">76.2%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[76%]"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Booking Utilization Rate</span>
                      <span className="font-medium">82.5%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[82%]"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">No-show Rate</span>
                      <span className="font-medium">5.8%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full w-[6%]"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Stay Duration</span>
                      <span className="font-medium">2.7 hours</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[54%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Occupancy Tab */}
          <TabsContent value="occupancy" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Zone Occupancy Analysis</CardTitle>
                    <CardDescription>
                      Detailed breakdown of occupancy by zone
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Total Seats</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Avg. Occupancy (%)
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Peak Hour</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Utilization (%)
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zoneOccupancy.map((zone) => (
                      <TableRow key={zone.zone}>
                        <TableCell className="font-medium">{zone.zone}</TableCell>
                        <TableCell>{zone.totalSeats}</TableCell>
                        <TableCell>{zone.avgOccupancy}%</TableCell>
                        <TableCell>{zone.peakHour}</TableCell>
                        <TableCell>{zone.utilization}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Occupancy Trends</CardTitle>
                  <CardDescription>
                    Occupancy patterns by day of week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <BarChart className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Day-of-week occupancy chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Occupancy Patterns</CardTitle>
                  <CardDescription>
                    Hour-by-hour occupancy breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Clock className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Hourly occupancy chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Heatmap</CardTitle>
                <CardDescription>
                  Visual representation of seat utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Seat occupancy heatmap would be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">High</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Map
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Revenue and payment statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹2,01,000</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Seat Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹1,40,000</div>
                      <p className="text-xs text-muted-foreground">
                        +8% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Late Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹29,000</div>
                      <p className="text-xs text-muted-foreground">
                        +15% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Membership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹32,000</div>
                      <p className="text-xs text-muted-foreground">
                        +5% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Total Revenue</TableHead>
                      <TableHead>Seat Bookings</TableHead>
                      <TableHead>Late Fees</TableHead>
                      <TableHead>Membership</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.totalRevenue}</TableCell>
                        <TableCell>{item.seatBookings}</TableCell>
                        <TableCell>{item.lateFees}</TableCell>
                        <TableCell>{item.membership}</TableCell>
                        <TableCell className={item.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {item.growth}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Latest payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.studentName}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Student Usage Analytics</CardTitle>
                    <CardDescription>
                      Detailed breakdown of student library usage
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search students..."
                      className="sm:w-[200px]"
                    />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Total Hours
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Bookings
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>No-Shows</TableHead>
                      <TableHead>Avg. Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentActivity.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium">
                          {student.studentId}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.totalHours}</TableCell>
                        <TableCell>{student.bookings}</TableCell>
                        <TableCell>{student.noShows}</TableCell>
                        <TableCell>{student.avgDuration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 50 students
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Demographics</CardTitle>
                  <CardDescription>
                    Student usage breakdown by department and year
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Users className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Student demographics chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Usage Patterns</CardTitle>
                  <CardDescription>
                    Library usage patterns by time of day
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Clock className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Usage pattern chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Insights</CardTitle>
                <CardDescription>
                  Key metrics about student library usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg. Time per Visit</p>
                    <p className="text-2xl font-bold">2.7 hours</p>
                    <p className="text-xs flex items-center text-success">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      +0.3 hours from previous period
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Frequent Users</p>
                    <p className="text-2xl font-bold">142</p>
                    <p className="text-xs flex items-center text-success">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      +12% from previous period
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No-Show Rate</p>
                    <p className="text-2xl font-bold">5.8%</p>
                    <p className="text-xs flex items-center text-destructive">
                      <ChevronDown className="h-3 w-3" />
                      -0.5% from previous period
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">New Users</p>
                    <p className="text-2xl font-bold">38</p>
                    <p className="text-xs flex items-center text-success">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      +15% from previous period
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Top Departments by Usage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Computer Science</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[28%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engineering</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[24%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Business</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[18%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
