import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sofa } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeatStatus } from "@/types";

// Core seat types
interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  user?: string;
  timeRemaining?: number;
  zone: 'left' | 'right';
  rowNumber: number;
}

interface Row {
  rowNumber: number;
  seats: Seat[];
}

interface SeatGroup {
  groupNumber: number;
  rows: Row[];
}

interface SeatMapProps {
  className?: string;
}

// Individual seat component for better reusability
const SeatItem = ({
  seat,
  selected,
  onSelect,
}: {
  seat: Seat;
  selected: boolean;
  onSelect: (seatId: string) => void;
}) => {
  const isSelectable = seat.status === "available";
  
  return (
    <button
      className={cn(
        "w-8 h-8 md:w-12 md:h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
        seat.zone === "right" ? "border-purple-500 bg-purple-50 hover:bg-purple-100" : "border-blue-500 bg-blue-50 hover:bg-blue-100",
        seat.status === "available" && "bg-green-50 hover:bg-green-100",
        seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
        seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
        seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={() => isSelectable && onSelect(seat.id)}
      disabled={!isSelectable}
      title={seat.user ? `${seat.user}` : undefined}
    >
      <Sofa 
        className={cn(
          "h-4 w-4 md:h-6 md:w-6",
          seat.zone === "right" ? "text-purple-600" : "text-blue-600",
          seat.status === "available" && "text-green-600",
          seat.status === "occupied" && "text-red-600",
          seat.status === "reserved" && "text-amber-600",
          seat.status === "maintenance" && "text-slate-500",
        )} 
      />
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] md:text-xs font-bold">
        {seat.number}
      </span>
      {seat.status === "reserved" && seat.timeRemaining && (
        <span className="absolute -top-4 md:-top-6 left-0 right-0 text-[8px] md:text-[10px] text-amber-600 font-medium">
          {seat.timeRemaining}m
        </span>
      )}
    </button>
  );
};

// Function to generate seat data (extracted from component)
const generateSeatData = (): SeatGroup[] => {
  const groups: SeatGroup[] = [];
  const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
  
  // Create 7 seat groups (each with 2 rows)
  for (let groupNumber = 1; groupNumber <= 7; groupNumber++) {
    const rows: Row[] = [];
    
    // Each group has 2 rows
    for (let rowOffset = 0; rowOffset < 2; rowOffset++) {
      const rowNumber = (groupNumber - 1) * 2 + rowOffset + 1;
      const rowStartSeat = (rowNumber - 1) * 7 + 1;
      const seats: Seat[] = [];
      
      // Right zone - 4 seats
      for (let col = 1; col <= 4; col++) {
        const seatNumber = rowStartSeat + col - 1;
        if (seatNumber <= 98) {
          const randomStatus = statuses[Math.floor(Math.random() * 4)];
          seats.push({
            id: `S-${seatNumber}`,
            number: `${seatNumber}`,
            status: randomStatus,
            zone: 'right',
            rowNumber,
            user: randomStatus === "occupied" || randomStatus === "reserved" ? 
              `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
            timeRemaining: randomStatus === "reserved" ? 
              Math.floor(Math.random() * 120) + 10 : undefined
          });
        }
      }
      
      // Left zone - 3 seats
      for (let col = 1; col <= 3; col++) {
        const seatNumber = rowStartSeat + 4 + col - 1;
        if (seatNumber <= 98) {
          const randomStatus = statuses[Math.floor(Math.random() * 4)];
          seats.push({
            id: `S-${seatNumber}`,
            number: `${seatNumber}`,
            status: randomStatus,
            zone: 'left',
            rowNumber,
            user: randomStatus === "occupied" || randomStatus === "reserved" ? 
              `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
            timeRemaining: randomStatus === "reserved" ? 
              Math.floor(Math.random() * 120) + 10 : undefined
          });
        }
      }
      
      rows.push({ rowNumber, seats });
    }
    
    groups.push({ groupNumber, rows });
  }
  
  return groups;
};

// Legend component for status indicators
const SeatStatusLegend = () => (
  <div className="flex flex-wrap gap-2 mb-4">
    <Badge variant="outline" className="bg-white border-green-500 text-green-600">
      Available
    </Badge>
    <Badge variant="outline" className="bg-red-100 border-red-500 text-red-600">
      Occupied
    </Badge>
    <Badge variant="outline" className="bg-amber-100 border-amber-500 text-amber-600">
      Reserved
    </Badge>
    <Badge variant="outline" className="bg-slate-100 border-slate-400 text-slate-500">
      Maintenance
    </Badge>
  </div>
);

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedShift, setSelectedShift] = useState<string>("morning");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatLayout] = useState<SeatGroup[]>(() => generateSeatData());
  const { toast } = useToast();
  
  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleReserveSeats = () => {
    if (selectedSeats.length === 0) return;
    
    toast({
      title: "Seats Reserved",
      description: `${selectedSeats.length} seat(s) have been reserved successfully.`,
    });
    
    setSelectedSeats([]);
  };

  const handleLockSeats = () => {
    if (selectedSeats.length === 0) return;
    
    toast({
      title: "Seats Locked",
      description: `${selectedSeats.length} seat(s) have been locked successfully.`,
    });
    
    setSelectedSeats([]);
  };
  
  return (
    <div className={cn("bg-white rounded-lg p-4 md:p-6 shadow-sm border", className)}>
      {/* Header with title and shift selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Seat Availability</h2>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Live updates
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (07AM-02PM)</SelectItem>
              <SelectItem value="evening">Evening (02PM-10PM)</SelectItem>
              <SelectItem value="lateEvening">Late Evening (02PM-12AM)</SelectItem>
              <SelectItem value="fullDay1">Full Day (07AM-12AM)</SelectItem>
              <SelectItem value="fullDay2">Full Day (07AM-10PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Seat status legend */}
      <div className="mb-4 md:mb-6">
        <SeatStatusLegend />
      </div>
      
      {/* Seat layout */}
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-6 md:gap-8 min-w-[600px] max-w-6xl mx-auto">
          {seatLayout.map((group) => (
            <div key={`group-${group.groupNumber}`} className="relative">
              <div className="absolute -left-2 md:-left-10 top-1/2 -translate-y-1/2 text-xs md:text-sm font-medium text-muted-foreground">
                {group.groupNumber * 2 - 1}-{group.groupNumber * 2}
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {group.rows.map((row) => (
                  <div key={`row-${row.rowNumber}`} className="grid grid-cols-11 gap-1 md:gap-2">
                    {/* Right zone - 4 seats */}
                    <div className="col-span-4 grid grid-cols-4 gap-1 md:gap-2">
                      {row.seats
                        .filter(seat => seat.zone === 'right')
                        .map((seat) => (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            selected={selectedSeats.includes(seat.id)}
                            onSelect={toggleSeatSelection}
                          />
                        ))}
                    </div>
                    
                    {/* 2-column gap */}
                    <div className="col-span-2"></div>
                    
                    {/* Left zone - 3 seats */}
                    <div className="col-span-5 grid grid-cols-3 gap-1 md:gap-2">
                      {row.seats
                        .filter(seat => seat.zone === 'left')
                        .map((seat) => (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            selected={selectedSeats.includes(seat.id)}
                            onSelect={toggleSeatSelection}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-6 md:mt-10 flex flex-wrap justify-end gap-2">
        <div className="text-sm text-muted-foreground mr-auto">
          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
        </div>
        <Button 
          variant="outline" 
          className="mr-2"
          disabled={selectedSeats.length === 0}
          onClick={handleReserveSeats}
        >
          Reserve Selected
        </Button>
        <Button 
          disabled={selectedSeats.length === 0}
          onClick={handleLockSeats}
        >
          Lock Selected
        </Button>
      </div>
    </div>
  );
};

export default SeatMap;
