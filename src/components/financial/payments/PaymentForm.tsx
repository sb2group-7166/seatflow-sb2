import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CreditCard, IndianRupee, Loader2, Receipt, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface PaymentFormData {
  studentId: string;
  studentName: string;
  paymentDate: Date | undefined;
  paymentType: 'membership' | 'booking' | 'other';
  amount: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  referenceNumber: string;
  description: string;
  isReceiptGenerated: boolean;
  receiptNumber: string;
  notes: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

interface PaymentFormProps {
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    studentId: '',
    studentName: '',
    paymentDate: new Date(),
    paymentType: 'membership',
    amount: '',
    paymentMethod: 'cash',
    referenceNumber: '',
    description: '',
    isReceiptGenerated: false,
    receiptNumber: '',
    notes: ''
  });

  // Mock data - replace with actual API calls
  const paymentTypes = [
    { id: 'membership', name: 'Membership Fee' },
    { id: 'booking', name: 'Booking Fee' },
    { id: 'other', name: 'Other' }
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Cash' },
    { id: 'card', name: 'Card' },
    { id: 'upi', name: 'UPI' },
    { id: 'bank_transfer', name: 'Bank Transfer' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form data
    if (!formData.studentId || !formData.amount || !formData.paymentDate) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format the date for the API
      const formattedDate = formData.paymentDate ? format(formData.paymentDate, 'yyyy-MM-dd') : '';
      const paymentData = {
        ...formData,
        paymentDate: formattedDate,
        amount: parseFloat(formData.amount)
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      const data = await response.json();
      
      // Close the form and show success message
      onClose();
      navigate('/payments', { 
        state: { 
          message: 'Payment processed successfully',
          paymentId: data.id 
        } 
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentIdChange = async (studentId: string) => {
    setFormData(prev => ({ ...prev, studentId }));
    if (studentId) {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/students/${studentId}`);
        // const data = await response.json();
        
        // Mock API response
        const mockStudent = {
          name: 'John Doe',
          membershipType: 'Premium'
        };
        
        setFormData(prev => ({ ...prev, studentName: mockStudent.name }));
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Process Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID *</Label>
            <div className="relative">
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleStudentIdChange(e.target.value)}
                placeholder="Enter student ID"
                required
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              disabled
              placeholder="Student name will appear here"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Payment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.paymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.paymentDate ? format(formData.paymentDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.paymentDate}
                  onSelect={(date) => setFormData({ ...formData, paymentDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Payment Type *</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData({ ...formData, paymentType: value as PaymentFormData['paymentType'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as PaymentFormData['paymentMethod'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference Number</Label>
          <Input
            id="referenceNumber"
            value={formData.referenceNumber}
            onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            placeholder="Enter reference number (if applicable)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter payment description"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="generateReceipt"
            checked={formData.isReceiptGenerated}
            onCheckedChange={(checked) => setFormData({ ...formData, isReceiptGenerated: checked as boolean })}
          />
          <Label htmlFor="generateReceipt">Generate Receipt</Label>
        </div>

        {formData.isReceiptGenerated && (
          <div className="space-y-2">
            <Label htmlFor="receiptNumber">Receipt Number</Label>
            <Input
              id="receiptNumber"
              value={formData.receiptNumber}
              onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
              placeholder="Enter receipt number"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes (optional)"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Process Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { PaymentForm }; 