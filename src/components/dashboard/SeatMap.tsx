
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SeatStatus = "available" | "occupied" | "reserved" | "selected" | "disabled";

interface Seat {
  id: string;
  number: number;
  status: SeatStatus;
  user?: string;
  timeRemaining?: number;
}

interface SeatMapProps {
  className?: string;
}

const SeatMap = ({ className }: SeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState("reading-area");
  const [selectedShift, setSelectedShift] = useState("morning");
  
  // Mock data for seats in different zones
  const zones = {
    "reading-area": generateSeats(24, 0.5, 0.2, 0.1),
    "computer-zone": generateSeats(18, 0.7, 0.1, 0.1),
    "quiet-study": generateSeats(16, 0.3, 0.3, 0.1),
    "group-study": generateSeats(12, 0.2, 0.6, 0.1),
  };
  
  const currentZoneSeats = zones[selectedZone as keyof typeof zones];
  
  // Mock function to generate seats with different statuses
  function generateSeats(count: number, occupiedProb: number, reservedProb: number, disabledProb: number): Seat[] {
    const seats: Seat[] = [];
    for (let i = 1; i <= count; i++) {
      const random = Math.random();
      let status: SeatStatus = "available";
      let user: string | undefined;
      let timeRemaining: number | undefined;
      
      if (random < occupiedProb) {
        status = "occupied";
        user = `Student #${Math.floor(Math.random() * 1000) + 1000}`;
      } else if (random < occupiedProb + reservedProb) {
        status = "reserved";
        user = `Student #${Math.floor(Math.random() * 1000) + 1000}`;
        timeRemaining = Math.floor(Math.random() * 120) + 10; // 10-130 minutes
      } else if (random < occupiedProb + reservedProb + disabledProb) {
        status = "disabled";
      }
      
      seats.push({
        id: `seat-${i}`,
        number: i,
        status,
        user,
        timeRemaining
      });
    }
    return seats;
  }
  
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Seat Availability</h2>
          <div className="flex items-center mt-1">
            <span className="live-indicator text-sm text-muted-foreground">
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
              <SelectItem value="reading-area">Reading Area</SelectItem>
              <SelectItem value="computer-zone">Computer Zone</SelectItem>
              <SelectItem value="quiet-study">Quiet Study</SelectItem>
              <SelectItem value="group-study">Group Study</SelectItem>
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
          <Badge variant="outline" className="bg-white border-success text-success">
            Available
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 border-destructive text-destructive">
            Occupied
          </Badge>
          <Badge variant="outline" className="bg-warning/10 border-warning text-warning">
            Reserved
          </Badge>
          <Badge variant="outline" className="bg-muted border-muted-foreground/30 text-muted-foreground/50">
            Disabled
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {currentZoneSeats.map((seat) => (
          <div key={seat.id} className={`seat seat-${seat.status}`}>
            <span>{seat.number}</span>
            {seat.status === "reserved" && seat.timeRemaining && (
              <span className="absolute -bottom-6 left-0 right-0 text-[10px] text-warning">
                {seat.timeRemaining}m left
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-2">Lock Selected</Button>
        <Button>Unlock Selected</Button>
      </div>
    </div>
  );
};

export default SeatMap;
