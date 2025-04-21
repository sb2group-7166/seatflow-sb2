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
  Calendar as CalendarIcon,
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
  CheckCircle,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Mock collections data
const collections = [
  {
    id: "A101",
    studentName: "Rahul Sharma",
    studentId: "STU1001",
    amount: 2500,
    date: "2024-04-15",
    dueDate: "2024-04-20",
    method: "UPI",
    category: "Monthly Fee",
    status: "completed",
    receiptNo: "RCPT001"
  },
  {
    id: "B205",
    studentName: "Priya Patel",
    studentId: "STU1002",
    amount: 5000,
    date: "2024-04-15",
    dueDate: "2024-04-20",
    method: "Cash",
    category: "Admission Fee",
    status: "completed",
    receiptNo: "RCPT002"
  },
  {
    id: "C301",
    studentName: "Amit Kumar",
    studentId: "STU1003",
    amount: 1500,
    date: "2024-04-14",
    dueDate: "2024-04-20",
    method: "PhonePe",
    category: "Exam Fee",
    status: "completed",
    receiptNo: "RCPT003"
  },
  {
    id: "D402",
    studentName: "Sneha Gupta",
    studentId: "STU1004",
    amount: 3000,
    date: "2024-04-14",
    dueDate: "2024-04-20",
    method: "Bank Transfer",
    category: "Monthly Fee",
    status: "completed",
    receiptNo: "RCPT004"
  },
  {
    id: "E503",
    studentName: "Vikram Singh",
    studentId: "STU1005",
    amount: 4500,
    date: "2024-04-13",
    dueDate: "2024-04-20",
    method: "UPI",
    category: "Admission Fee",
    status: "completed",
    receiptNo: "RCPT005"
  },
  {
    id: "F604",
    studentName: "Ananya Reddy",
    studentId: "STU1006",
    amount: 2000,
    date: "2024-04-13",
    dueDate: "2024-04-20",
    method: "Cash",
    category: "Monthly Fee",
    status: "completed",
    receiptNo: "RCPT006"
  },
  {
    id: "G705",
    studentName: "Rohan Mehta",
    studentId: "STU1007",
    amount: 3500,
    date: "2024-04-12",
    dueDate: "2024-04-20",
    method: "PhonePe",
    category: "Monthly Fee",
    status: "completed",
    receiptNo: "RCPT007"
  },
  {
    id: "H806",
    studentName: "Neha Joshi",
    studentId: "STU1008",
    amount: 4000,
    date: "2024-04-12",
    dueDate: "2024-04-20",
    method: "Bank Transfer",
    category: "Admission Fee",
    status: "completed",
    receiptNo: "RCPT008"
  }
];

interface CollectionRecord {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  date: string;
  method: string;
  category: string;
  status: string;
  receiptNo: string;
}

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<CollectionRecord | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [quickDueFilter, setQuickDueFilter] = useState("all");
  const [paymentMode, setPaymentMode] = useState("all");
  const [receivedBy, setReceivedBy] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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

  // Filter collections based on search query, date range, payment mode, and selected card
  const filteredCollections = collections.filter((collection) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      collection.studentName.toLowerCase().includes(query) ||
      collection.studentId.toLowerCase().includes(query) ||
      collection.id.toLowerCase().includes(query);
    
    const collectionDate = new Date(collection.date);
    const matchesDateRange = dateRange?.from && dateRange?.to
      ? collectionDate >= dateRange.from && collectionDate <= dateRange.to
      : true;
    
    const dueDate = new Date(collection.dueDate);
    const today = new Date();
    const oneDayFromNow = new Date(today);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    
    const matchesQuickDueFilter = quickDueFilter === "all" 
      ? true 
      : quickDueFilter === "today" 
        ? dueDate.toDateString() === today.toDateString()
        : quickDueFilter === "tomorrow"
          ? dueDate.toDateString() === oneDayFromNow.toDateString()
          : quickDueFilter === "overdue"
            ? dueDate < today
            : true;
    
    const matchesPaymentMode = paymentMode === "all" || collection.method === paymentMode;

    // Filter based on selected card
    const matchesSelectedCard = selectedCard === null ? true :
      selectedCard === "total" ? true :
      selectedCard === "today" ? new Date(collection.date).toDateString() === new Date().toDateString() :
      selectedCard === "april" ? new Date(collection.date).getMonth() === 3 : true;
    
    return matchesSearch && matchesDateRange && matchesQuickDueFilter && 
           matchesPaymentMode && matchesSelectedCard;
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

  const generateReceipt = (collection: CollectionRecord) => {
    const receipt = `
      SEATFLOW COLLECTION RECEIPT
      ==========================
      
      Receipt Details:
      ---------------
      Receipt No: ${collection.receiptNo}
      Date: ${format(new Date(collection.date), 'dd/MM/yyyy hh:mm a')}
      
      Student Details:
      ---------------
      Name: ${collection.studentName}
      ID: ${collection.studentId}
      
      Collection Details:
      -----------------
      Amount: ${formatRupee(collection.amount)}
      Category: ${collection.category}
      Payment Method: ${collection.method}
      Status: ${collection.status}
      
      ==========================
      Thank you for your payment!
      This is a computer generated receipt.
      Please keep this receipt for your records.
      ==========================
    `;

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `receipt_${collection.receiptNo}.txt`);
  };

  const generatePDF = (collection: CollectionRecord) => {
    const doc = new jsPDF();
    
    // Add header with logo and title
    doc.setFontSize(24);
    doc.setTextColor(0, 128, 0);
    doc.text('SEATFLOW', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('COLLECTION RECEIPT', 105, 30, { align: 'center' });
    
    // Add receipt details with better formatting
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Receipt Details:', 20, 45);
    doc.setFontSize(10);
    doc.text(`Receipt No: ${collection.receiptNo}`, 20, 55);
    doc.text(`Date: ${format(new Date(collection.date), 'dd/MM/yyyy hh:mm a')}`, 20, 65);
    
    // Add student details
    doc.setFontSize(12);
    doc.text('Student Details:', 20, 85);
    doc.setFontSize(10);
    doc.text(`Name: ${collection.studentName}`, 20, 95);
    doc.text(`ID: ${collection.studentId}`, 20, 105);
    
    // Add collection details with amount highlighted
    doc.setFontSize(12);
    doc.text('Collection Details:', 20, 125);
    doc.setFontSize(10);
    doc.text(`Amount: ${formatRupee(collection.amount)}`, 20, 135);
    doc.text(`Category: ${collection.category}`, 20, 145);
    doc.text(`Payment Method: ${collection.method}`, 20, 155);
    doc.text(`Status: ${collection.status}`, 20, 165);

    // Add Terms & Conditions
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', 20, 185);
    doc.setFontSize(8);
    const terms = [
      '1. This is an official computer-generated receipt.',
      '2. No signature is required on this receipt.',
      '3. Please keep this receipt for your records.',
      '4. This receipt is valid for all official purposes.',
      '5. No refunds or cancellations are allowed once payment is processed.',
      '6. For any queries, please contact the administration office.',
      '7. All disputes are subject to local jurisdiction.'
    ];
    terms.forEach((term, index) => {
      doc.text(term, 20, 195 + (index * 5));
    });

    // Add signature section
    doc.setFontSize(10);
    doc.text('Authorized Signatory', 140, 240);
    doc.line(140, 242, 180, 242); // Signature line
    
    // Add footer with disclaimer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is a computer generated receipt and does not require physical signature.', 105, 270, { align: 'center' });
    
    // Save the PDF
    doc.save(`receipt_${collection.receiptNo}.pdf`);
  };

  const ReceiptPreview = ({ collection }: { collection: CollectionRecord }) => {
    return (
      <Dialog open={showReceiptPreview} onOpenChange={setShowReceiptPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-emerald-600">Collection Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {collection && (
              <div className="bg-white p-8 rounded-lg border shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-emerald-600">SEATFLOW COLLECTION RECEIPT</h2>
                  <div className="border-t border-gray-200 my-4"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg">Receipt Details</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Receipt No</p>
                        <p className="font-medium text-lg">{collection.receiptNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-lg">{format(new Date(collection.date), 'dd/MM/yyyy hh:mm a')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg">Student Details</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-lg">{collection.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID</p>
                        <p className="font-medium text-lg">{collection.studentId}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg">Collection Details</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-2xl text-emerald-600">{formatRupee(collection.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-lg">{collection.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium text-lg">{collection.method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-lg text-emerald-600">{collection.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8"></div>
                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p>This is a computer generated receipt.</p>
                  <p>Please keep this receipt for your records.</p>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Button 
                    variant="outline"
                    onClick={() => generatePDF(collection)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.print()}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting collections in ${format.toUpperCase()} format...`,
    });
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    // Reset other filters when a card is clicked
    setDateRange(undefined);
    setQuickDueFilter("all");
    setPaymentMode("all");
    setReceivedBy("all");
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
              <h1 className="text-2xl sm:text-3xl font-bold">Collections</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Track and manage payment collections
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
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCard === "total" ? "ring-2 ring-green-400" : ""}`}
            onClick={() => handleCardClick("total")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl font-medium">Total Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold flex items-center text-green-400">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  9000
                </div>
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">Overall collections</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCard === "today" ? "ring-2 ring-green-400" : ""}`}
            onClick={() => handleCardClick("today")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl font-medium">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold flex items-center text-green-400">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  2500
                </div>
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">Collections for today</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCard === "april" ? "ring-2 ring-green-400" : ""}`}
            onClick={() => handleCardClick("april")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl font-medium">April Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold flex items-center text-green-400">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  6500
                </div>
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">Collections for April</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by student name, ID, or collection ID..."
                className="w-full pl-8 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Collection Date Range */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-full",
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
                      <span>Collection Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Collection Date Quick Filter */}
            <div className="w-full">
              <Select value={quickDueFilter} onValueChange={setQuickDueFilter}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Collection Date Filter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Collection Dates</SelectItem>
                  <SelectItem value="today">Today's Collections</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow's Collections</SelectItem>
                  <SelectItem value="overdue">Overdue Collections</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Mode Filter */}
            <div className="w-full">
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Payment Modes</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="PhonePe">PhonePe</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Google Pay">Google Pay</SelectItem>
                  <SelectItem value="Paytm">Paytm</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="DD">Demand Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Received By Filter */}
            <div className="w-full">
              <Select value={receivedBy} onValueChange={setReceivedBy}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Received By" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="staff1">Staff 1</SelectItem>
                  <SelectItem value="staff2">Staff 2</SelectItem>
                  <SelectItem value="staff3">Staff 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Recent Collections</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing collections for {months[selectedMonth]} {selectedYear}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="whitespace-nowrap text-xs border-r">Seat No</TableHead>
                    <TableHead className="whitespace-nowrap text-xs border-r">Student</TableHead>
                    <TableHead className="whitespace-nowrap text-xs border-r">Amount</TableHead>
                    <TableHead className="whitespace-nowrap text-xs border-r">Received On</TableHead>
                    <TableHead className="whitespace-nowrap text-xs border-r">Payment Mode</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection) => (
                      <TableRow key={collection.id} className="border-b">
                        <TableCell className="font-medium whitespace-nowrap text-xs border-r">{collection.id}</TableCell>
                        <TableCell className="border-r">
                          <div>
                            <p className="font-medium text-xs">{collection.studentName}</p>
                            <p className="text-xs text-muted-foreground">{collection.studentId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-green-400 font-bold text-xs border-r">{formatRupee(collection.amount)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs border-r">{format(new Date(collection.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs border-r">{collection.method}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setCurrentReceipt(collection);
                                setShowReceiptPreview(true);
                              }}
                            >
                              <Receipt className="h-3 w-3 mr-1" />
                              Receipt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                // Share functionality
                                if (navigator.share) {
                                  navigator.share({
                                    title: 'Collection Receipt',
                                    text: `Collection Receipt for ${collection.studentName}`,
                                    url: window.location.href,
                                  });
                                } else {
                                  toast({
                                    title: "Share",
                                    description: "Sharing is not supported on this device",
                                  });
                                }
                              }}
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground text-xs">No collections found matching the current filters</p>
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
          <ReceiptPreview collection={currentReceipt} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollectionsPage; 