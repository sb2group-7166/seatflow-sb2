
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sofa } from "lucide-react";

// Define types for seat within this component
interface Seat {
  id: string;
  number: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  user?: string;
  timeRemaining?: number;
}

interface SeatMapProps {
  className?: string;
}

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedShift, setSelectedShift] = useState("morning");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const generateSeatLayout = () => {
    // Generate a layout of 98 seats with 7 columns (3 on left, 4 on right)
    return createSeats();
  };
  
  const createSeats = () => {
    const seats = [];
    const statuses = ["available", "occupied", "reserved", "maintenance"];
    
    // Create 14 rows with 7 seats each (3 on the left, 4 on the right)
    // This gives us 98 seats total
    for (let row = 1; row <= 14; row++) {
      const leftRowSeats = [];
      const rightRowSeats = [];
      
      // Left section - 3 columns
      for (let col = 1; col <= 3; col++) {
        const seatId = `L-${row}-${col}`;
        // First row has higher chance of available seats
        const randomStatus = statuses[Math.floor(Math.random() * (row === 1 ? 2 : 4))] as "available" | "occupied" | "reserved" | "maintenance";
        
        leftRowSeats.push({
          id: seatId,
          number: `L${row}${col}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      // Right section - 4 columns
      for (let col = 1; col <= 4; col++) {
        const seatId = `R-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * 4)] as "available" | "occupied" | "reserved" | "maintenance";
        
        rightRowSeats.push({
          id: seatId,
          number: `R${row}${col}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push({ leftRowSeats, rightRowSeats });
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
      
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        {seatRows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {rowIndex + 1}
            </div>
            
            <div className="grid grid-cols-9 gap-2">
              {/* Left section - 3 columns */}
              <div className="col-span-3 grid grid-cols-3 gap-2">
                {row.leftRowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      "border-blue-500 bg-blue-50 hover:bg-blue-100",
                      seat.status === "available" && "bg-green-50 hover:bg-green-100",
                      seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                      seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                      seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                      selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                    onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                    disabled={seat.status !== "available"}
                  >
                    <Sofa 
                      className={cn(
                        "h-6 w-6",
                        "text-blue-600",
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
              
              {/* Middle gap - 2 columns */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="w-full h-0.5 border-t-2 border-dashed border-slate-200"></div>
              </div>
              
              {/* Right section - 4 columns */}
              <div className="col-span-4 grid grid-cols-4 gap-2">
                {row.rightRowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      "border-purple-500 bg-purple-50 hover:bg-purple-100",
                      seat.status === "available" && "bg-green-50 hover:bg-green-100",
                      seat.status === "occupied" && "border-red-500 bg-red-50 cursor-not-allowed",
                      seat.status === "reserved" && "border-amber-500 bg-amber-50 cursor-not-allowed",
                      seat.status === "maintenance" && "border-slate-400 bg-slate-100 cursor-not-allowed",
                      selectedSeats.includes(seat.id) && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                    onClick={() => seat.status === "available" && toggleSeatSelection(seat.id)}
                    disabled={seat.status !== "available"}
                  >
                    <Sofa 
                      className={cn(
                        "h-6 w-6",
                        "text-purple-600",
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
