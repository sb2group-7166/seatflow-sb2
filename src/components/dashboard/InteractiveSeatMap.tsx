import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Sofa } from "lucide-react";

type SeatStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
}

interface InteractiveSeatMapProps {
  className?: string;
}

const InteractiveSeatMap = ({ className }: InteractiveSeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    // Generate seats in a 7x14 grid with alternating row numbering
    const generateSeats = () => {
      const statuses: SeatStatus[] = ['available', 'occupied', 'reserved', 'maintenance'];
      const totalSeats = 7 * 14; // 7 columns, 14 rows
      
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
        
        return {
          id: `seat-${seatNumber}`,
          number: String(seatNumber).padStart(2, '0'),
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };
      });

      setSeats(newSeats);
    };

    generateSeats();
  }, []);

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-sm border", className)}>
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Seat Layout</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Available
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Occupied
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Reserved
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            Maintenance
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {seats.map((seat, index) => {
          const row = Math.floor(index / 7) + 1;
          const col = (index % 7) + 1;
          
          // Add extra space after column 3
          const isAfterThirdColumn = col === 3;
          
          return (
            <React.Fragment key={seat.id}>
              <div
                className={cn(
                  "p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1",
                  seat.status === 'available' && "border-green-500 bg-green-50",
                  seat.status === 'occupied' && "border-red-500 bg-red-50",
                  seat.status === 'reserved' && "border-amber-500 bg-amber-50",
                  seat.status === 'maintenance' && "border-slate-400 bg-slate-100"
                )}
              >
                <Sofa className={cn(
                  "w-6 h-6",
                  seat.status === 'available' && "text-green-500",
                  seat.status === 'occupied' && "text-red-500",
                  seat.status === 'reserved' && "text-amber-500",
                  seat.status === 'maintenance' && "text-slate-400"
                )} />
                <span className="text-xs font-medium">{seat.number}</span>
              </div>
              {isAfterThirdColumn && <div className="col-span-1" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveSeatMap;