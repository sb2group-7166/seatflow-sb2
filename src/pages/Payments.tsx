
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, IndianRupee, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.today).replace('₹', '')}
                </div>
                <Calendar className="h-8 w-8 text-primary/70" />
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
                <div className="text-3xl font-bold flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.month).replace('₹', '')}
                </div>
                <TrendingUp className="h-8 w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">April 2024</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1 text-primary/70" />
                  {formatRupee(collectionStats.total).replace('₹', '')}
                </div>
                <Users className="h-8 w-8 text-primary/70" />
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
                  <div>
                    <Button>Generate Invoice</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
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
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  <Button>
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    Export to Excel
                  </Button>
                  <Button variant="outline">
                    Export to PDF
                  </Button>
                </div>

                <div className="mt-6 p-4 border rounded-md">
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-2xl font-bold">153</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <div className="flex items-center text-2xl font-bold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        15,250
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Transaction</p>
                      <div className="flex items-center text-2xl font-bold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        324
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
