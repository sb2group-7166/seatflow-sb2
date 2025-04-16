import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { 
  IndianRupee, 
  Settings,
  Search,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

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
  }
];

const PaymentsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter payments based on search query
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    return (
      payment.studentName.toLowerCase().includes(query) ||
      payment.studentId.toLowerCase().includes(query) ||
      payment.id.toLowerCase().includes(query)
    );
  });

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">
              Track and manage payment transactions
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  750
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Total collected today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  8500
                </div>
                <CheckCircle className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month's collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  150
                </div>
                <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  50
                </div>
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Recent Payments</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="w-full sm:w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-xs text-muted-foreground">{payment.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatRupee(payment.amount)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
