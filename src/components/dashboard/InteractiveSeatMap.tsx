import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Sofa, Clock, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StudentInfoDialog from './StudentInfoDialog';
import PreBookedSeatDialog from './PreBookedSeatDialog';
import { Student } from "@/types";

type SeatStatus = 'available' | 'occupied' | 'pre-booked';

interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  student?: Student;
}

interface InteractiveSeatMapProps {
  className?: string;
  onSeatSelect?: (seatNumber: string) => void;
  showOnlyAvailable?: boolean;
}

const shifts = [
  { id: 'morning', name: 'Morning Shift', time: '07:00 AM - 02:00 PM' },
  { id: 'evening8', name: 'Evening Shift (08 Hours)', time: '02:00 PM - 10:00 PM' },
  { id: 'evening10', name: 'Evening Shift (10 Hours)', time: '02:00 PM - 12:00 AM' },
  { id: 'full15', name: 'Full Day Shift (15 Hours)', time: '07:00 AM - 10:00 PM' },
  { id: 'full17', name: 'Full Day Shift (17 Hours)', time: '07:00 AM - 12:00 AM' },
];

// Mock student data
const mockStudents: Student[] = [
  { 
    id: 'ST001', 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    phone: '+1234567890',
    fatherName: 'Robert Doe',
    admissionDate: '2023-01-15',
    idProof: 'A123456',
    address: '123 Main St, City',
    status: 'active'
  },
  { 
    id: 'ST002', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    fatherName: 'William Smith',
    admissionDate: '2023-02-20',
    idProof: 'B789012',
    address: '456 Oak Ave, Town',
    status: 'active'
  },
  { 
    id: 'ST003', 
    name: 'Mike Johnson', 
    email: 'mike.johnson@example.com',
    phone: '+1122334455',
    fatherName: 'David Johnson',
    admissionDate: '2023-03-10',
    idProof: 'C345678',
    address: '789 Pine Rd, Village',
    status: 'active'
  },
  { 
    id: 'ST004', 
    name: 'Sarah Williams', 
    email: 'sarah.williams@example.com',
    phone: '+1555666777',
    fatherName: 'James Williams',
    admissionDate: '2023-04-05',
    idProof: 'D901234',
    address: '321 Elm St, County',
    status: 'active'
  },
  { 
    id: 'ST005', 
    name: 'David Brown', 
    email: 'david.brown@example.com',
    phone: '+1888999000',
    fatherName: 'Thomas Brown',
    admissionDate: '2023-05-12',
    idProof: 'E567890',
    address: '654 Maple Dr, State',
    status: 'active'
  }
];

// Typical occupancy patterns for each shift
const shiftOccupancy = {
  morning: {
    available: 0.7, // 70% available
    occupied: 0.2, // 20% occupied
    preBooked: 0.1, // 10% pre-booked
  },
  evening8: {
    available: 0.5, // 50% available
    occupied: 0.3, // 30% occupied
    preBooked: 0.2, // 20% pre-booked
  },
  evening10: {
    available: 0.4, // 40% available
    occupied: 0.4, // 40% occupied
    preBooked: 0.2, // 20% pre-booked
  },
  full15: {
    available: 0.3, // 30% available
    occupied: 0.5, // 50% occupied
    preBooked: 0.2, // 20% pre-booked
  },
  full17: {
    available: 0.2, // 20% available
    occupied: 0.6, // 60% occupied
    preBooked: 0.2, // 20% pre-booked
  },
};

const InteractiveSeatMap = ({ 
  className, 
  onSeatSelect,
  showOnlyAvailable = false 
}: InteractiveSeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generateSeatsForShift = (shiftId: string) => {
    const statuses: SeatStatus[] = ['available', 'occupied', 'pre-booked'];
    const totalSeats = 7 * 14; // 7 columns, 14 rows
    const occupancy = shiftOccupancy[shiftId as keyof typeof shiftOccupancy];
    
    const newSeats: Seat[] = Array.from({ length: totalSeats }, (_, i) => {
      const row = Math.floor(i / 7) + 1;
      const col = (i % 7) + 1;
      
      // Calculate seat number based on row and column
      let seatNumber: number;
      if (row % 2 === 1) {
        // Odd rows: right-to-left (7 to 1)
        seatNumber = (row - 1) * 7 + (8 - col);
      } else {
        // Even rows: left-to-right (1 to 7)
        seatNumber = (row - 1) * 7 + col;
      }

      // Determine seat status based on occupancy pattern
      const random = Math.random();
      let status: SeatStatus;
      if (random < occupancy.available) {
        status = 'available';
      } else if (random < occupancy.available + occupancy.occupied) {
        status = 'occupied';
      } else {
        status = 'pre-booked';
      }

      // Assign student to occupied seats
      let student: Student | undefined;
      if (status === 'occupied' || status === 'pre-booked') {
        const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
        student = randomStudent;
      }
      
      return {
        id: `seat-${seatNumber}`,
        number: String(seatNumber).padStart(2, '0'),
        status,
        student
      };
    });

    setSeats(newSeats);
  };

  useEffect(() => {
    // Set current date
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    generateSeatsForShift(selectedShift.id);
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedShift.id]);

  useEffect(() => {
    const handleSeatStatusUpdate = (event: CustomEvent) => {
      const { seatId, status, student } = event.detail;
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === seatId 
            ? { ...seat, status, student } 
            : seat
        )
      );
    };

    window.addEventListener('seatStatusUpdate', handleSeatStatusUpdate as EventListener);

    return () => {
      window.removeEventListener('seatStatusUpdate', handleSeatStatusUpdate as EventListener);
    };
  }, []);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat.number);
    setSelectedStudent(seat.student || null);
    setIsDialogOpen(true);
    if (onSeatSelect) {
      onSeatSelect(seat.number);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-sm border", className)}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Seat Layout</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Available
            </div>
            {!showOnlyAvailable && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Occupied
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Pre-booked
                </div>
              </>
            )}
          </div>
        </div>
        {!showOnlyAvailable && (
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm font-medium text-gray-700">{currentDate}</div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <Select
                value={selectedShift.id}
                onValueChange={(value) => {
                  const shift = shifts.find(s => s.id === value);
                  if (shift) {
                    setSelectedShift(shift);
                    generateSeatsForShift(value);
                  }
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name} ({shift.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-8 gap-2">
        {seats.map((seat, index) => {
          const row = Math.floor(index / 7) + 1;
          const col = (index % 7) + 1;
          
          // Skip non-available seats if showOnlyAvailable is true
          if (showOnlyAvailable && seat.status !== 'available') {
            return null;
          }
          
          return (
            <React.Fragment key={seat.id}>
              {/* Add visual separation between columns 3 and 4 */}
              {col === 4 && (
                <div className="col-span-1 border-l-2 border-dashed border-gray-300 mx-2" />
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all",
                        seat.status === 'available' && "border-green-500 bg-green-50 hover:bg-green-100",
                        seat.status === 'occupied' && "border-red-500 bg-red-50",
                        seat.status === 'pre-booked' && "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100",
                        selectedSeat === seat.number && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => handleSeatClick(seat)}
                    >
                      <Sofa className={cn(
                        "w-6 h-6",
                        seat.status === 'available' && "text-green-500",
                        seat.status === 'occupied' && "text-red-500",
                        seat.status === 'pre-booked' && "text-purple-600"
                      )} />
                      <span className="text-xs font-medium">{seat.number}</span>
                      {seat.student && !showOnlyAvailable && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className={cn(
                            "w-3 h-3",
                            seat.status === 'occupied' ? "text-red-500" : "text-purple-500"
                          )} />
                          <span className={cn(
                            "text-[10px] font-medium",
                            seat.status === 'occupied' ? "text-red-500" : "text-purple-500"
                          )}>{seat.student.id}</span>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seat {seat.number}</p>
                    <p>Status: {seat.status}</p>
                    {seat.student && (
                      seat.status === 'pre-booked' ? (
                        <p>Pre-booked by: {seat.student.name}</p>
                      ) : (
                        <p>Occupied by: {seat.student.name}</p>
                      )
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </React.Fragment>
          );
        })}
      </div>

      {selectedSeat && seats.find(s => s.number === selectedSeat)?.status === 'pre-booked' ? (
        <PreBookedSeatDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          student={selectedStudent || undefined}
          seatNumber={selectedSeat}
        />
      ) : (
        <StudentInfoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          student={selectedStudent || undefined}
          seatNumber={selectedSeat || ''}
        />
      )}
    </div>
  );
};

export default InteractiveSeatMap;