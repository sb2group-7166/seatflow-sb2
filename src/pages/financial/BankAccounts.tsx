import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard, 
  Building2, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft,
  User,
  Phone,
  Banknote,
  FileText,
  CreditCard as CreditCardIcon,
  QrCode,
  Calendar,
  Shield,
  AlertCircle,
  Landmark
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  lastTransaction: string;
  upiId?: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  openingDate: string;
  nomineeName?: string;
  nomineeRelation?: string;
  payeeName: string;
  payeePhone: string;
  payeeType: 'bank' | 'upi';
  accountPurpose: string;
  panNumber: string;
}

const mockAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "State Bank of India",
    accountNumber: "XXXX1234",
    accountType: "Savings",
    balance: 250000,
    currency: "INR",
    status: "active",
    lastTransaction: "2024-03-15",
    upiId: "sbi@upi",
    ifscCode: "SBIN0001234",
    branchName: "Main Branch",
    accountHolderName: "John Doe",
    openingDate: "2023-01-01",
    nomineeName: "Jane Doe",
    nomineeRelation: "Spouse",
    payeeName: "John Doe",
    payeePhone: "+919876543210",
    payeeType: "bank",
    accountPurpose: "Salary",
    panNumber: "ABCDE1234FG"
  },
  {
    id: "2",
    bankName: "HDFC Bank",
    accountNumber: "XXXX5678",
    accountType: "Current",
    balance: 500000,
    currency: "INR",
    status: "active",
    lastTransaction: "2024-03-14",
    upiId: "hdfc@upi",
    payeeName: "Jane Doe",
    payeePhone: "+919876543210",
    payeeType: "upi",
    accountPurpose: "Rent"
  },
  {
    id: "3",
    bankName: "ICICI Bank",
    accountNumber: "XXXX9012",
    accountType: "Savings",
    balance: 150000,
    currency: "INR",
    status: "inactive",
    lastTransaction: "2024-02-28",
    upiId: "icici@upi",
    payeeName: "John Doe",
    payeePhone: "+919876543210",
    payeeType: "bank",
    accountPurpose: "Salary"
  }
];

const ACCOUNT_PURPOSES = [
  "Salary",
  "Rent",
  "Utilities",
  "Maintenance",
  "Student Fees",
  "Vendor Payment",
  "Loan Payment",
  "Investment",
  "Savings",
  "Emergency Fund",
  "Other"
];

const BankAccountsPage = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState<Partial<BankAccount>>({});

  const handleAddAccount = () => {
    if (!formData.payeeName || !formData.payeePhone || !formData.payeeType || 
        !formData.accountPurpose || !formData.panNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.payeeType === 'bank' && (!formData.accountNumber || !formData.ifscCode)) {
      toast({
        title: "Error",
        description: "Please fill in all bank account details",
        variant: "destructive",
      });
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: formData.bankName || '',
      accountNumber: formData.accountNumber || '',
      accountType: formData.accountType || 'savings',
      balance: formData.balance || 0,
      currency: "INR",
      status: "active",
      lastTransaction: new Date().toISOString().split('T')[0],
      upiId: formData.upiId,
      ifscCode: formData.ifscCode || '',
      branchName: formData.branchName || '',
      accountHolderName: formData.payeeName,
      openingDate: formData.openingDate || new Date().toISOString().split('T')[0],
      payeeName: formData.payeeName,
      payeePhone: formData.payeePhone,
      payeeType: formData.payeeType,
      accountPurpose: formData.accountPurpose,
      panNumber: formData.panNumber
    };

    setAccounts([...accounts, newAccount]);
    setIsAddDialogOpen(false);
    setFormData({});
    toast({
      title: "Success",
      description: "Account added successfully",
    });
  };

  const handleEditAccount = () => {
    if (!selectedAccount || !formData.bankName || !formData.accountNumber || !formData.accountType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedAccounts = accounts.map(account => 
      account.id === selectedAccount.id 
        ? { ...account, ...formData }
        : account
    );

    setAccounts(updatedAccounts);
    setIsEditDialogOpen(false);
    setSelectedAccount(null);
    setFormData({});
    toast({
      title: "Success",
      description: "Bank account updated successfully",
    });
  };

  const handleDeleteAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    setAccounts(updatedAccounts);
    toast({
      title: "Success",
      description: "Bank account deleted successfully",
    });
  };

  const openEditDialog = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormData(account);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Bank Accounts</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your bank accounts and transactions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Add Bank Account or UPI ID</DialogTitle>
                <p className="text-center text-muted-foreground text-sm sm:text-base">Fill in the details to add a new account</p>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold">Personal Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm sm:text-base">
                        <User className="h-4 w-4 text-blue-600" />
                        Payee Name*
                      </Label>
                      <Input 
                        placeholder="Enter Payee Name" 
                        value={formData.payeeName || ''}
                        onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm sm:text-base">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Payee Phone*
                      </Label>
                      <Input 
                        placeholder="Enter Phone Number" 
                        value={formData.payeePhone || ''}
                        onChange={(e) => setFormData({ ...formData, payeePhone: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm sm:text-base">
                      <Landmark className="h-4 w-4 text-blue-600" />
                      Payee Type*
                    </Label>
                    <select 
                      className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.payeeType || ''}
                      onChange={(e) => setFormData({ ...formData, payeeType: e.target.value as 'bank' | 'upi' })}
                    >
                      <option value="">Select Payee Type</option>
                      <option value="bank" className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 inline-block mr-2" />
                        Bank Account
                      </option>
                      <option value="upi" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 inline-block mr-2" />
                        UPI ID
                      </option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold">Bank / UPI Details</h3>
                  </div>
                  {formData.payeeType === 'bank' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm sm:text-base">
                            <Landmark className="h-4 w-4 text-blue-600" />
                            Account Number
                          </Label>
                          <Input 
                            placeholder="Bank Account Number" 
                            value={formData.accountNumber || ''}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm sm:text-base">
                            <FileText className="h-4 w-4 text-blue-600" />
                            IFSC Code
                          </Label>
                          <Input 
                            placeholder="IFSC Code (11 letters)" 
                            value={formData.ifscCode || ''}
                            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm sm:text-base">
                        <QrCode className="h-4 w-4 text-blue-600" />
                        UPI ID
                      </Label>
                      <Input 
                        placeholder="Enter UPI ID" 
                        value={formData.upiId || ''}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold">Additional Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm sm:text-base">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Account Purpose*
                      </Label>
                      <select 
                        className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.accountPurpose || ''}
                        onChange={(e) => setFormData({ ...formData, accountPurpose: e.target.value })}
                      >
                        <option value="">Select Purpose</option>
                        {ACCOUNT_PURPOSES.map((purpose) => (
                          <option key={purpose} value={purpose}>
                            {purpose}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm sm:text-base">
                        <Shield className="h-4 w-4 text-blue-600" />
                        PAN CARD Number*
                      </Label>
                      <Input 
                        placeholder="10 digit PAN Number" 
                        value={formData.panNumber || ''}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    onClick={handleAddAccount}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {account.payeeType === 'bank' ? (
                      <Landmark className="h-5 w-5 text-blue-600" />
                    ) : (
                      <QrCode className="h-5 w-5 text-blue-600" />
                    )}
                    <CardTitle className="text-base sm:text-lg">{account.payeeName}</CardTitle>
                  </div>
                  <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                    {account.payeeType === 'bank' ? 'Bank Account' : 'UPI ID'}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {account.payeeType === 'bank' ? `Account: ${account.accountNumber}` : `UPI: ${account.upiId}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm font-medium">{account.payeePhone}</span>
                  </div>
                  {account.payeeType === 'bank' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">IFSC Code</span>
                        <span className="text-sm font-medium">{account.ifscCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-semibold">{account.balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Purpose</span>
                    <span className="text-sm font-medium">{account.accountPurpose}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PAN Number</span>
                    <span className="text-sm font-medium">{account.panNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditDialog(account)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View your recent bank transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm sm:text-base">Date</TableHead>
                    <TableHead className="text-sm sm:text-base">Description</TableHead>
                    <TableHead className="text-sm sm:text-base">Account</TableHead>
                    <TableHead className="text-sm sm:text-base">Amount</TableHead>
                    <TableHead className="text-sm sm:text-base">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm sm:text-base">2024-03-15</TableCell>
                    <TableCell className="text-sm sm:text-base">Monthly Rent Payment</TableCell>
                    <TableCell className="text-sm sm:text-base">SBI - XXXX1234</TableCell>
                    <TableCell className="text-red-600 text-sm sm:text-base">-₹50,000</TableCell>
                    <TableCell>
                      <ArrowDownLeft className="h-4 w-4 text-red-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm sm:text-base">2024-03-14</TableCell>
                    <TableCell className="text-sm sm:text-base">Student Payment</TableCell>
                    <TableCell className="text-sm sm:text-base">HDFC - XXXX5678</TableCell>
                    <TableCell className="text-green-600 text-sm sm:text-base">+₹25,000</TableCell>
                    <TableCell>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm sm:text-base">2024-03-13</TableCell>
                    <TableCell className="text-sm sm:text-base">Utility Bill Payment</TableCell>
                    <TableCell className="text-sm sm:text-base">ICICI - XXXX9012</TableCell>
                    <TableCell className="text-red-600 text-sm sm:text-base">-₹5,000</TableCell>
                    <TableCell>
                      <ArrowDownLeft className="h-4 w-4 text-red-600" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input 
                placeholder="Enter bank name" 
                value={formData.bankName || ''}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input 
                placeholder="Enter account number" 
                value={formData.accountNumber || ''}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.accountType || ''}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              >
                <option value="">Select account type</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="fixed">Fixed Deposit</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Balance</Label>
              <Input 
                type="number" 
                placeholder="Enter balance" 
                value={formData.balance || ''}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input 
                placeholder="Enter UPI ID" 
                value={formData.upiId || ''}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleEditAccount}>Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BankAccountsPage; 