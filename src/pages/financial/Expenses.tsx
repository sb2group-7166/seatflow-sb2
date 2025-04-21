import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  AlertCircle,
  ArrowLeft,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  XCircle,
  Smartphone,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  QrCode,
  User,
  Loader2,
  Plus,
  Receipt,
  Building2,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as DatePicker } from "@/components/ui/calendar";

// Mock expenses data
const expenses = [
  {
    id: "EXP001",
    description: "Office Supplies",
    amount: 2500,
    date: "2024-04-10",
    category: "Office",
    paymentMethod: "UPI",
    status: "approved",
    receiptNo: "RCPT001",
    approvedBy: "Admin User"
  },
  {
    id: "EXP002",
    description: "Internet Bill",
    amount: 5000,
    date: "2024-04-10",
    category: "Utilities",
    paymentMethod: "Bank Transfer",
    status: "pending",
    receiptNo: "RCPT002",
    approvedBy: null
  },
  {
    id: "EXP003",
    description: "Maintenance",
    amount: 1500,
    date: "2024-04-09",
    category: "Facility",
    paymentMethod: "Cash",
    status: "rejected",
    receiptNo: "RCPT003",
    approvedBy: "Admin User"
  }
];

interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  status: string;
  receiptNo: string;
  approvedBy: string | null;
}

const ExpensesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ExpenseRecord | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paidBy, setPaidBy] = useState("all");
  const [category, setCategory] = useState("all");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: 0,
    date: new Date(),
    paidBy: "",
    paidTo: "",
    description: "",
    paymentMode: "cash",
    billImage: null as File | null
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Filter expenses based on search query, month, date range, payment status, paid by, and category
  const filteredExpenses = expenses.filter((expense) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      expense.description.toLowerCase().includes(query) ||
      expense.id.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query);
    
    const expenseDate = new Date(expense.date);
    const matchesMonth = expenseDate.getMonth() === selectedMonth && 
                        expenseDate.getFullYear() === selectedYear;
    
    // Date range filter
    const matchesDateRange = dateRange?.from && dateRange?.to
      ? expenseDate >= dateRange.from && expenseDate <= dateRange.to
      : true;
    
    // Payment status filter
    const matchesPaymentStatus = paymentStatus === "all" || expense.status === paymentStatus;
    
    // Paid by filter
    const matchesPaidBy = paidBy === "all" || expense.approvedBy === paidBy;
    
    // Category filter
    const matchesCategory = category === "all" || expense.category === category;
    
    return matchesSearch && matchesMonth && matchesDateRange && 
           matchesPaymentStatus && matchesPaidBy && matchesCategory;
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
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const generateReceipt = (expense: ExpenseRecord) => {
    const receipt = `
      SEATFLOW EXPENSE RECEIPT
      =======================
      
      Receipt Details:
      ---------------
      Receipt No: ${expense.receiptNo}
      Date: ${format(new Date(expense.date), 'dd/MM/yyyy')}
      Expense ID: ${expense.id}
      Status: ${expense.status}
      ${expense.approvedBy ? `Approved By: ${expense.approvedBy}` : ''}
      
      Expense Details:
      ---------------
      Description: ${expense.description}
      Amount: ${formatRupee(expense.amount)}
      Category: ${expense.category}
      Payment Method: ${expense.paymentMethod}
      
      =======================
      This is a computer generated receipt.
      Please keep this receipt for your records.
      =======================
    `;

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `expense_receipt_${expense.receiptNo}.txt`);
  };

  const ReceiptPreview = ({ expense }: { expense: ExpenseRecord }) => {
    return (
      <Dialog open={showReceiptPreview} onOpenChange={setShowReceiptPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-600">SEATFLOW EXPENSE RECEIPT</h2>
              <div className="border-t border-gray-200 my-4"></div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Receipt Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Receipt No</p>
                    <p className="font-medium">{expense.receiptNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{format(new Date(expense.date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expense ID</p>
                    <p className="font-medium">{expense.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-emerald-600">{expense.status}</p>
                  </div>
                  {expense.approvedBy && (
                    <div>
                      <p className="text-sm text-gray-500">Approved By</p>
                      <p className="font-medium">{expense.approvedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Expense Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{expense.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">{formatRupee(expense.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{expense.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>
            <div className="text-center text-sm text-gray-500">
              <p>This is a computer generated receipt.</p>
              <p>Please keep this receipt for your records.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting expenses in ${format.toUpperCase()} format...`,
    });
  };

  const handleCardClick = (category: string) => {
    // Set the search query to filter by the selected category
    setSearchQuery(category);
    
    // Show a toast notification
    toast({
      title: "Filter Applied",
      description: `Showing expenses for ${category}`,
    });
  };

  const handleAddExpense = () => {
    // Handle adding new expense
    toast({
      title: "Expense Added",
      description: "New expense has been added successfully",
    });
    setShowAddExpenseModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Track and manage expenses
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth} className="shrink-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center min-w-[120px]">
                <p className="font-medium">{months[selectedMonth]} {selectedYear}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleNextMonth} className="shrink-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("print")}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={() => setShowAddExpenseModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => handleCardClick("")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center text-amber-600">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  9000
                </div>
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total expenses this month</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => handleCardClick("Salary")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Salary Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center text-amber-600">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  4500
                </div>
                <User className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Staff salary payments</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => handleCardClick("Rent")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Rent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center text-amber-600">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  2500
                </div>
                <Building2 className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Monthly rent payment</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => handleCardClick("Utilities")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Utilities & Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center text-amber-600">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  2000
                </div>
                <Wrench className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Electricity & maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by description, ID, or category..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Date Range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range: DateRange | undefined) => {
                      if (range) {
                        setDateRange(range);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Payment Status Filter */}
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Paid By Filter */}
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Paid By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                <SelectItem value="Admin User">Admin User</SelectItem>
                <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                <SelectItem value="Accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Facility">Facility</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-medium">Recent Expenses</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing expenses for {months[selectedMonth]} {selectedYear}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-medium">Expense ID</TableHead>
                    <TableHead className="text-xs font-medium">Description</TableHead>
                    <TableHead className="text-xs font-medium">Amount</TableHead>
                    <TableHead className="text-xs font-medium">Date</TableHead>
                    <TableHead className="text-xs font-medium">Category</TableHead>
                    <TableHead className="text-xs font-medium">Payment Method</TableHead>
                    <TableHead className="text-xs font-medium">Status</TableHead>
                    <TableHead className="text-xs font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="text-xs">{expense.id}</TableCell>
                        <TableCell className="text-xs">{expense.description}</TableCell>
                        <TableCell className="text-xs">{formatRupee(expense.amount)}</TableCell>
                        <TableCell className="text-xs">{expense.date}</TableCell>
                        <TableCell className="text-xs">{expense.category}</TableCell>
                        <TableCell className="text-xs">{expense.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCurrentReceipt(expense);
                              setShowReceiptPreview(true);
                            }}
                          >
                            <Receipt className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-xs text-muted-foreground">No expenses found matching the current filters</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Preview */}
        {showReceiptPreview && currentReceipt && (
          <ReceiptPreview expense={currentReceipt} />
        )}

        {/* Add Expense Modal */}
        <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="text-sm">Select category</Label>
                  <Select 
                    value={newExpense.category} 
                    onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-sm">Amount</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                    className="h-9"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-sm">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9",
                          !newExpense.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newExpense.date ? format(newExpense.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={newExpense.date}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            setNewExpense({...newExpense, date});
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Paid By */}
                <div className="space-y-2">
                  <Label className="text-sm">Paid By</Label>
                  <Input 
                    placeholder="Enter name"
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                    className="h-9"
                  />
                </div>

                {/* Paid To */}
                <div className="space-y-2">
                  <Label className="text-sm">Paid To</Label>
                  <Input 
                    placeholder="Enter recipient name"
                    value={newExpense.paidTo}
                    onChange={(e) => setNewExpense({...newExpense, paidTo: e.target.value})}
                    className="h-9"
                  />
                </div>

                {/* Upload Bill */}
                <div className="space-y-2">
                  <Label className="text-sm">Upload Bill</Label>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewExpense({...newExpense, billImage: file});
                      }
                    }}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <Textarea 
                  placeholder="Details about payment"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              {/* Collection Mode */}
              <div className="space-y-2">
                <Label className="text-sm">Collection Mode</Label>
                <RadioGroup 
                  value={newExpense.paymentMode}
                  onValueChange={(value) => setNewExpense({...newExpense, paymentMode: value})}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="text-sm">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gpay" id="gpay" />
                    <Label htmlFor="gpay" className="text-sm">GPay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phonepe" id="phonepe" />
                    <Label htmlFor="phonepe" className="text-sm">Phone Pe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paytm" id="paytm" />
                    <Label htmlFor="paytm" className="text-sm">Paytm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="text-sm">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="text-sm">Bank</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="text-sm">Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheque" id="cheque" />
                    <Label htmlFor="cheque" className="text-sm">Cheque</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="others" id="others" />
                    <Label htmlFor="others" className="text-sm">Others</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowAddExpenseModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>
                Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ExpensesPage; 