
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sofa } from "lucide-react";
import { Seat, SeatStatus } from "@/types";

interface SeatMapProps {
  className?: string;
}

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState("full-day");
  const [selectedShift, setSelectedShift] = useState("morning");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const generateSeatLayout = () => {
    const zones = {
      "full-day": createFullDaySeats(),
      "half-day": createHalfDaySeats(),
    };
    
    return zones[selectedZone as keyof typeof zones];
  };
  
  const createFullDaySeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    // Create 6 rows with 4 seats each row (total 48 seats for full day)
    for (let row = 1; row <= 12; row++) {
      const rowSeats = [];
      
      for (let col = 1; col <= 4; col++) {
        const seatId = `F-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * (row === 1 ? 2 : 4))] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `F${row}${String.fromCharCode(64 + col)}`,
          status: randomStatus,
          user: randomStatus === "occupied" || randomStatus === "reserved" ? `Student #${Math.floor(Math.random() * 1000) + 1000}` : undefined,
          timeRemaining: randomStatus === "reserved" ? Math.floor(Math.random() * 120) + 10 : undefined
        });
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  const createHalfDaySeats = () => {
    const seats = [];
    const statuses: SeatStatus[] = ["available", "occupied", "reserved", "maintenance"];
    
    // Create 12-13 rows with 4 seats each (total 50 seats for half day)
    for (let row = 1; row <= 13; row++) {
      const rowSeats = [];
      const seatsPerRow = row === 13 ? 2 : 4; // Last row has only 2 seats to reach 50 total
      
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatId = `H-${row}-${col}`;
        const randomStatus = statuses[Math.floor(Math.random() * 4)] as SeatStatus;
        
        rowSeats.push({
          id: seatId,
          number: `H${row}${col}`,
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
              <SelectItem value="full-day">Full Day Seats (48)</SelectItem>
              <SelectItem value="half-day">Half Day Seats (50)</SelectItem>
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
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {rowIndex + 1}
            </div>
            
            <div className="flex justify-center gap-6">
              <div className="flex gap-2">
                {row.slice(0, Math.ceil(row.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      selectedZone === "full-day" ? "border-purple-500 bg-purple-50 hover:bg-purple-100" : "border-yellow-500 bg-yellow-50 hover:bg-yellow-100",
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
                        selectedZone === "full-day" ? "text-purple-600" : "text-yellow-600",
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
              
              <div className="w-8 border-t-2 border-dashed border-slate-200 self-center"></div>
              
              <div className="flex gap-2">
                {row.slice(Math.ceil(row.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "w-12 h-12 rounded-t-lg border-2 flex items-center justify-center relative transition-all",
                      selectedZone === "full-day" ? "border-purple-500 bg-purple-50 hover:bg-purple-100" : "border-yellow-500 bg-yellow-50 hover:bg-yellow-100",
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
                        selectedZone === "full-day" ? "text-purple-600" : "text-yellow-600",
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
