
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, IndianRupee, TrendingUp, Users, Download, FileSpreadsheet, FileText, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock payment data
const payments = [
  {
    id: "INV001",
    studentName: "Alex Johnson",
    studentId: "STU1001",
    amount: 250,
    status: "completed",
    date: "2024-04-10",
    method: "UPI",
    description: "Seat booking fee"
  },
  {
    id: "INV002",
    studentName: "Priya Patel",
    studentId: "STU1004",
    amount: 500,
    status: "completed",
    date: "2024-04-10",
    method: "Credit Card",
    description: "Monthly membership"
  },
  {
    id: "INV003",
    studentName: "David Martinez",
    studentId: "STU1003",
    amount: 150,
    status: "pending",
    date: "2024-04-09",
    method: "Net Banking",
    description: "Fine payment"
  },
  {
    id: "INV004",
    studentName: "Samantha Lee",
    studentId: "STU1002",
    amount: 1000,
    status: "completed",
    date: "2024-04-08",
    method: "UPI",
    description: "Full semester access"
  },
  {
    id: "INV005",
    studentName: "Michael Wong",
    studentId: "STU1005",
    amount: 100,
    status: "failed",
    date: "2024-04-06",
    method: "Debit Card",
    description: "Daily pass"
  },
];

// Collection stats
const collectionStats = {
  today: 750,
  month: 8500,
  total: 125000
};

const PaymentsPage = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Format Indian Rupee
  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your payment report has been generated successfully.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `Export to ${format.toUpperCase()}`,
      description: `Your data has been exported to ${format.toUpperCase()} format.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 md:h-6 md:w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.today).replace('₹', '')}
                </div>
                <Calendar className="h-7 w-7 md:h-8 md:w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated as of today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Month's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 md:h-6 md:w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.month).replace('₹', '')}
                </div>
                <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">April 2024</p>
            </CardContent>
          </Card>
          
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 md:h-6 md:w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.total).replace('₹', '')}
                </div>
                <Users className="h-7 w-7 md:h-8 md:w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Lifetime total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Payment transactions from all students</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="w-full sm:w-[220px] pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                      />
                    </div>
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>
                            <div>
                              {payment.studentName}
                              <p className="text-sm text-muted-foreground">{payment.studentId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {payment.amount}
                            </div>
                            <p className="text-xs text-muted-foreground">{payment.description}</p>
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">5</span> of <span className="font-medium">25</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Payment Reports</CardTitle>
                <CardDescription>
                  Generate customized payment reports for any date range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div>
                    <p className="text-sm font-medium mb-2">Start Date</p>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">End Date</p>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleGenerateReport}>
                    <Filter className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to PDF
                  </Button>
                </div>

                <div className="mt-6 p-4 border rounded-md">
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-xl md:text-2xl font-bold">153</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <div className="flex items-center text-xl md:text-2xl font-bold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {formatRupee(15250).replace('₹', '')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Transaction</p>
                      <div className="flex items-center text-xl md:text-2xl font-bold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {formatRupee(324).replace('₹', '')}
                      </div>
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

export default PaymentsPage;
