import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, X, Loader2, User, MapPin, Clock4, Bookmark, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface BookingFormData {
  studentId: string;
  seatId: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  shift: string;
  notes: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

interface QuickBookingFormProps {
  onClose: () => void;
}

const QuickBookingForm: React.FC<QuickBookingFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudentId, setIsLoadingStudentId] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    studentId: '',
    seatId: '',
    date: undefined,
    startTime: '',
    endTime: '',
    shift: '',
    notes: ''
  });

  // Fetch last student ID and generate new one
  useEffect(() => {
    const fetchLastStudentId = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/students/last-id');
        // const data = await response.json();
        
        // Mock API response
        const mockLastId = 'STD20230099'; // This would come from your API
        const newId = generateNextStudentId(mockLastId);
        
        setFormData(prev => ({ ...prev, studentId: newId }));
      } catch (error) {
        console.error('Error fetching last student ID:', error);
        // Fallback to current year if API fails
        const currentYear = new Date().getFullYear();
        const fallbackId = `STD${currentYear}0001`;
        setFormData(prev => ({ ...prev, studentId: fallbackId }));
      } finally {
        setIsLoadingStudentId(false);
      }
    };

    fetchLastStudentId();
  }, []);

  const generateNextStudentId = (lastId: string): string => {
    // Extract year and number from last ID (format: STDYYYYXXXX)
    const year = lastId.substring(3, 7);
    const number = parseInt(lastId.substring(7));
    
    // Get current year
    const currentYear = new Date().getFullYear().toString();
    
    // If year is different, start from 0001
    if (year !== currentYear) {
      return `STD${currentYear}0001`;
    }
    
    // Increment the number and pad with zeros
    const nextNumber = (number + 1).toString().padStart(4, '0');
    return `STD${currentYear}${nextNumber}`;
  };

  // Mock data - replace with actual API calls
  const shifts = [
    { id: 'morning', name: 'Morning (07:00 AM - 02:00 PM)' },
    { id: 'evening', name: 'Evening (02:00 PM - 10:00 PM)' },
    { id: 'lateEvening', name: 'Late Evening (02:00 PM - 12:00 AM)' },
    { id: 'fullDay1', name: 'Full Day (07:00 AM - 10:00 PM)' },
    { id: 'fullDay2', name: 'Full Day (07:00 AM - 12:00 AM)' }
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form data
    if (!formData.studentId || !formData.seatId || !formData.date || !formData.startTime || !formData.endTime || !formData.shift) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Validate time range
    const startTime = parseInt(formData.startTime.split(':')[0]);
    const endTime = parseInt(formData.endTime.split(':')[0]);
    if (endTime <= startTime) {
      setError('End time must be after start time');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format the date and time for the API
      const formattedDate = formData.date ? format(formData.date, 'yyyy-MM-dd') : '';
      const bookingData = {
        ...formData,
        date: formattedDate,
        startTime: `${formattedDate}T${formData.startTime}:00`,
        endTime: `${formattedDate}T${formData.endTime}:00`
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await response.json();
      
      // Close the form and show success message
      onClose();
      navigate('/bookings', { 
        state: { 
          message: 'Booking created successfully',
          bookingId: data.id 
        } 
      });
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Quick Booking
        </h2>
        <p className="text-sm text-muted-foreground">Book a seat in just a few clicks</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Student Information Section */}
        <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Student Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-sm font-medium">Student ID <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="Enter student ID"
                  required
                  className={cn(
                    "focus:ring-2 focus:ring-primary/20",
                    isLoadingStudentId && "animate-pulse"
                  )}
                  disabled={isLoadingStudentId}
                />
                {isLoadingStudentId && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated ID based on previous records
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatId" className="text-sm font-medium">Seat Number <span className="text-red-500">*</span></Label>
              <Input
                id="seatId"
                value={formData.seatId}
                onChange={(e) => setFormData({ ...formData, seatId: e.target.value })}
                placeholder="Enter seat number"
                required
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Booking Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal focus:ring-2 focus:ring-primary/20",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Shift <span className="text-red-500">*</span></Label>
              <Select
                value={formData.shift}
                onValueChange={(value) => setFormData({ ...formData, shift: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <Clock4 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Time Selection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Time <span className="text-red-500">*</span></Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => setFormData({ ...formData, startTime: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">End Time <span className="text-red-500">*</span></Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => setFormData({ ...formData, endTime: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="space-y-6 bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Additional Notes</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes (optional)"
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px] bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default QuickBookingForm; 