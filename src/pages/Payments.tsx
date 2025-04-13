
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Filter, 
  Calendar, 
  ArrowUpDown, 
  Download, 
  PlusCircle,
  Receipt,
  Clock,
  CalendarDays 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: "TRX1001",
    date: "2023-04-10",
    amount: 15.00,
    studentName: "Alex Johnson",
    studentId: "STU1001",
    type: "Seat Booking",
    status: "completed",
    paymentMethod: "Credit Card",
    reference: "SB-12345"
  },
  {
    id: "TRX1002",
    date: "2023-04-09",
    amount: 10.00,
    studentName: "Samantha Lee",
    studentId: "STU1002",
    type: "Fine",
    status: "completed",
    paymentMethod: "Online Banking",
    reference: "FN-67890"
  },
  {
    id: "TRX1003",
    date: "2023-04-08",
    amount: 50.00,
    studentName: "David Martinez",
    studentId: "STU1003",
    type: "Membership",
    status: "pending",
    paymentMethod: "Credit Card",
    reference: "MM-54321"
  },
  {
    id: "TRX1004",
    date: "2023-04-07",
    amount: 25.00,
    studentName: "Priya Patel",
    studentId: "STU1004",
    type: "Seat Booking",
    status: "failed",
    paymentMethod: "Debit Card",
    reference: "SB-98765"
  },
  {
    id: "TRX1005",
    date: "2023-04-06",
    amount: 15.00,
    studentName: "Michael Wong",
    studentId: "STU1005",
    type: "Seat Booking",
    status: "completed",
    paymentMethod: "Mobile Payment",
    reference: "SB-24680"
  }
];

const PaymentsPage = () => {
  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 border-green-500 text-green-500">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500 text-yellow-500">Pending</Badge>;
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
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage payments, transactions, and financial records
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$2,580.50</div>
                <DollarSign className="h-8 w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Seat Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$1,875.00</div>
                <Receipt className="h-8 w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">72.7% of total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fines Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$355.50</div>
                <Clock className="h-8 w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">13.8% of total revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Memberships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$350.00</div>
                <CalendarDays className="h-8 w-8 text-primary/70" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">13.5% of total revenue</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View and manage all financial transactions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search transactions..."
                      className="sm:w-[200px]"
                    />
                    <Button size="icon" variant="outline">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                    <Button size="icon" variant="outline">
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Date Range</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          ID
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer">
                          Amount
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            {transaction.studentName}
                            <p className="text-xs text-muted-foreground">
                              {transaction.studentId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell className="font-medium">
                          ${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">5</span> of{" "}
                    <span className="font-medium">50</span> transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Download and analyze financial data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Monthly Revenue Report</p>
                        <p className="text-sm text-muted-foreground">
                          April 2023 (PDF)
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Transaction Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Last Quarter (XLSX)
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Payment Method Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Year-to-Date (CSV)
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Generate New Report
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Analytics</CardTitle>
                  <CardDescription>
                    Key metrics and trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Payment Methods</span>
                      <span className="text-sm text-muted-foreground">Count</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm">Credit Card</span>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm">Online Banking</span>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[25%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm">Mobile Payment</span>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[10%]"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Top Payment Categories</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Seat Bookings</span>
                        <span className="text-sm font-medium">$1,875.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fines</span>
                        <span className="text-sm font-medium">$355.50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Memberships</span>
                        <span className="text-sm font-medium">$350.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure payment methods and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Gateways</h3>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-muted-foreground">
                          Credit/Debit Cards, Apple Pay, Google Pay
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500 text-green-500">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">
                          PayPal Account, Credit/Debit Cards
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500 text-yellow-500">
                      Setup Required
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Fee Structure</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Seat Booking (Per Hour)</p>
                      <p className="text-lg font-medium">$3.00</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Late Fee (Per Hour)</p>
                      <p className="text-lg font-medium">$5.00</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Membership</p>
                      <p className="text-lg font-medium">$25.00</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Membership</p>
                      <p className="text-lg font-medium">$250.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Invoice Settings</h3>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Automatic Receipt Generation</p>
                      <p className="text-sm text-muted-foreground">
                        Send email receipts for all transactions
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500 text-green-500">
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Payment Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Send reminders for upcoming and overdue payments
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500 text-green-500">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
