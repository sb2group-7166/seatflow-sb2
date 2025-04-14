
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sofa, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeatStatus, SeatZone } from "@/types";

// Define types for seat within this component
interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  user?: string;
  timeRemaining?: number;
}

interface SeatMapProps {
  className?: string;
}

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedShift, setSelectedShift] = useState<string>("morning");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Generate a layout of 98 seats with joined rows
  const generateSeatLayout = () => {
    // Create 7 joined rows (pairs of original rows), with 14 seats per joined row
    return createSeats();
  };
  
  const createSeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    // Each joined row consists of 2 original rows
    for (let joinedRow = 1; joinedRow <= 7; joinedRow++) {
      const rowPair = [];
      
      // Process each pair of rows (e.g., rows 1-2, 3-4, etc.)
      for (let rowInPair = 0; rowInPair < 2; rowInPair++) {
        const originalRow = (joinedRow - 1) * 2 + rowInPair + 1;
        const leftRowSeats = [];
        const rightRowSeats = [];
        
        // Right section - 4 columns (first, numbered 1-7 in first row)
        for (let col = 1; col <= 4; col++) {
          // For the first row, seats 1-7 are specifically numbered
          const seatNumber = rowInPair === 0 && joinedRow === 1 ? col : null; 
          const seatId = `R-${originalRow}-${col}`;
          const randomStatus = statuses[Math.floor(Math.random() * 4)];
          
          rightRowSeats.push({
            id: seatId,
            // First row, right side: seats 1-4
            number: seatNumber ? `${seatNumber}` : `${(originalRow - 1) * 7 + col + 4}`,
            status: randomStatus,
            user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
            timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
          });
        }
        
        // Left section - 3 columns (first row contains seats 5-7)
        for (let col = 1; col <= 3; col++) {
          // For the first row, left side contains seats 5-7
          const seatNumber = rowInPair === 0 && joinedRow === 1 ? col + 4 : null;
          const seatId = `L-${originalRow}-${col}`;
          const randomStatus = statuses[Math.floor(Math.random() * 4)];
          
          leftRowSeats.push({
            id: seatId,
            // First row, left side: seats 5-7
            // For subsequent rows, continue numbering
            number: seatNumber ? `${seatNumber}` : `${(originalRow - 1) * 7 + col + 4 + 3}`,
            status: randomStatus,
            user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
            timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
          });
        }
        
        rowPair.push({ leftRowSeats, rightRowSeats, rowNumber: originalRow });
      }
      
      seats.push({ rowPair, joinedRowNumber: joinedRow });
    }
    
    return seats;
  };
  
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
  
  const seatRows = generateSeatLayout();
  
  return (
    <div className={cn("bg-white rounded-lg p-4 md:p-6 shadow-sm border", className)}>
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
      
      <div className="mb-4 md:mb-6">
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
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-6 md:gap-8 min-w-[600px] max-w-6xl mx-auto">
          {seatRows.map((joinedRow) => (
            <div key={joinedRow.joinedRowNumber} className="relative">
              <div className="absolute -left-2 md:-left-10 top-1/2 -translate-y-1/2 text-xs md:text-sm font-medium text-muted-foreground">
                {joinedRow.joinedRowNumber * 2 - 1}-{joinedRow.joinedRowNumber * 2}
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {joinedRow.rowPair.map((row, rowIdx) => (
                  <div key={`row-${row.rowNumber}`} className="grid grid-cols-9 gap-1 md:gap-2">
                    {/* Right section - 4 columns (shown first in the layout) */}
                    <div className="col-span-4 grid grid-cols-4 gap-1 md:gap-2">
                      {row.rightRowSeats.map((seat) => (
                        <button
                          key={seat.id}
                          className={cn(
                            "w-8 h-8 md:w-12 md:h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                            "border-purple-500 bg-purple-50 hover:bg-purple-100",
                            seat.status === "available" && "bg-green-50 hover:bg-green-100",
                            seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                            seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                            seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                            selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                          )}
                          onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                          disabled={seat.status !== "available"}
                          title={seat.user ? `${seat.user}` : undefined}
                        >
                          <Sofa 
                            className={cn(
                              "h-4 w-4 md:h-6 md:w-6",
                              "text-purple-600",
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
                      ))}
                    </div>
                    
                    {/* Middle gap - 2 columns */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                      <div className="w-full h-0.5 border-t-2 border-dashed border-slate-200"></div>
                    </div>
                    
                    {/* Left section - 3 columns */}
                    <div className="col-span-4 md:col-span-3 grid grid-cols-3 gap-1 md:gap-2">
                      {row.leftRowSeats.map((seat) => (
                        <button
                          key={seat.id}
                          className={cn(
                            "w-8 h-8 md:w-12 md:h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                            "border-blue-500 bg-blue-50 hover:bg-blue-100",
                            seat.status === "available" && "bg-green-50 hover:bg-green-100",
                            seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                            seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                            seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                            selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                          )}
                          onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                          disabled={seat.status !== "available"}
                          title={seat.user ? `${seat.user}` : undefined}
                        >
                          <Sofa 
                            className={cn(
                              "h-4 w-4 md:h-6 md:w-6",
                              "text-blue-600",
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
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
