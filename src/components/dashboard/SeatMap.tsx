
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Chair } from "lucide-react";
import { Seat, SeatStatus } from "@/types";

interface SeatMapProps {
  className?: string;
}

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState("reading-area");
  const [selectedShift, setSelectedShift] = useState("morning");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Create a layout with 98 seats in total
  const generateSeatLayout = () => {
    const zones = {
      "reading-area": createReadingAreaSeats(),
      "computer-zone": createComputerZoneSeats(),
      "quiet-study": createQuietStudySeats(),
      "group-study": createGroupStudySeats(),
    };
    
    return zones[selectedZone as keyof typeof zones];
  };
  
  // Reading area: 32 seats (8 rows of 4)
  const createReadingAreaSeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    for (let row = 1; row <= 8; row++) {
      const rowSeats = [];
      
      for (let col = 1; col <= 4; col++) {
        const seatId = `RA-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * (row === 1 ? 2 : 4))] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `${row}${String.fromCharCode(64 + col)}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  // Computer zone: 24 seats (8 rows of 3)
  const createComputerZoneSeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    for (let row = 1; row <= 8; row++) {
      const rowSeats = [];
      
      for (let col = 1; col <= 3; col++) {
        const seatId = `CZ-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * 4)] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `C${row}${col}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  // Quiet study: 30 seats (6 rows of 3 + 4 rows of 3)
  const createQuietStudySeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    for (let row = 1; row <= 10; row++) {
      const rowSeats = [];
      const seatsPerRow = row <= 6 ? 3 : 3;
      
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatId = `QS-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * 4)] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `Q${row}${col}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  // Group study: 12 seats (3 rows of 4)
  const createGroupStudySeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    for (let row = 1; row <= 3; row++) {
      const rowSeats = [];
      
      for (let col = 1; col <= 4; col++) {
        const seatId = `GS-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * 4)] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `G${row}${col}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push(rowSeats);
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
  
  const seatRows = generateSeatLayout();
  
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Seat Availability</h2>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-sm text-muted-foreground">
              Live updates
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reading-area">Reading Area (32)</SelectItem>
              <SelectItem value="computer-zone">Computer Zone (24)</SelectItem>
              <SelectItem value="quiet-study">Quiet Study (30)</SelectItem>
              <SelectItem value="group-study">Group Study (12)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8AM-1PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (1PM-6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM-11PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
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
      
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {seatRows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            {/* Row label */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {rowIndex + 1}
            </div>
            
            {/* Seats */}
            <div className="flex justify-center gap-6">
              {/* First half of the row */}
              <div className="flex gap-2">
                {row.slice(0, Math.ceil(row.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      seat.status === "available" && "border-green-500 bg-green-50 hover:bg-green-100",
                      seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                      seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                      seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                      selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                    onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                    disabled={seat.status !== "available"}
                  >
                    <Chair 
                      className={cn(
                        "h-6 w-6",
                        seat.status === "available" && "text-green-600",
                        seat.status === "occupied" && "text-red-600",
                        seat.status === "reserved" && "text-amber-600",
                        seat.status === "maintenance" && "text-slate-500",
                      )} 
                    />
                    <span className="absolute -bottom-6 left-0 right-0 text-xs font-medium">
                      {seat.number}
                    </span>
                    {seat.status === "reserved" && seat.timeRemaining && (
                      <span className="absolute -top-6 left-0 right-0 text-[10px] text-amber-600 font-medium">
                        {seat.timeRemaining}m
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Aisle space */}
              <div className="w-8 border-t-2 border-dashed border-slate-200 self-center"></div>
              
              {/* Second half of the row */}
              <div className="flex gap-2">
                {row.slice(Math.ceil(row.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      seat.status === "available" && "border-green-500 bg-green-50 hover:bg-green-100",
                      seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                      seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                      seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                      selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                    onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                    disabled={seat.status !== "available"}
                  >
                    <Chair 
                      className={cn(
                        "h-6 w-6",
                        seat.status === "available" && "text-green-600",
                        seat.status === "occupied" && "text-red-600",
                        seat.status === "reserved" && "text-amber-600",
                        seat.status === "maintenance" && "text-slate-500",
                      )} 
                    />
                    <span className="absolute -bottom-6 left-0 right-0 text-xs font-medium">
                      {seat.number}
                    </span>
                    {seat.status === "reserved" && seat.timeRemaining && (
                      <span className="absolute -top-6 left-0 right-0 text-[10px] text-amber-600 font-medium">
                        {seat.timeRemaining}m
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-end gap-2">
        <div className="text-sm text-muted-foreground mr-auto">
          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
        </div>
        <Button 
          variant="outline" 
          className="mr-2"
          disabled={selectedSeats.length === 0}
        >
          Reserve Selected
        </Button>
        <Button disabled={selectedSeats.length === 0}>Lock Selected</Button>
      </div>
    </div>
  );
};

export default SeatMap;
