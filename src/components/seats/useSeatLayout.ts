import { useEffect, useState, useCallback } from "react";
import { SeatStatus } from "@/types";

interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  user?: string;
  timeRemaining?: number;
}

interface RowSeats {
  leftRowSeats: Seat[];
  rightRowSeats: Seat[];
  rowNumber: number;
}

interface SeatRowGroup {
  rowPair: RowSeats[];
  joinedRowNumber: number;
}

const statuses: SeatStatus[] = ["available", "occupied", "pre-booked"];

export const useSeatLayout = () => {
  const [seatRows, setSeatRows] = useState<SeatRowGroup[]>([]);

  // Use useCallback to memoize the createSeats function
  const createSeats = useCallback(() => {
    const seats: SeatRowGroup[] = [];
    let seatNumber = 1;

    for (let joinedRow = 1; joinedRow <= 7; joinedRow++) {
      const rowPair: RowSeats[] = [];
      for (let rowInPair = 0; rowInPair < 2; rowInPair++) {
        const originalRow = (joinedRow - 1) * 2 + rowInPair + 1;
        const rightRowSeats: Seat[] = [];
        const leftRowSeats: Seat[] = [];

        // Right section - 4 seats
        for (let col = 0; col < 4 && seatNumber <= 98; col++) {
          rightRowSeats.push(generateSeat(seatNumber));
          seatNumber++;
        }

        // Left section - 3 seats
        for (let col = 0; col < 3 && seatNumber <= 98; col++) {
          leftRowSeats.push(generateSeat(seatNumber));
          seatNumber++;
        }

        rowPair.push({ leftRowSeats, rightRowSeats, rowNumber: originalRow });
      }

      seats.push({ rowPair, joinedRowNumber: joinedRow });
    }
    return seats;
  }, []);

  useEffect(() => {
    setSeatRows(createSeats());
  }, [createSeats]);

  const generateSeat = (seatNumber: number): Seat => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `S-${seatNumber}`,
      number: `${seatNumber}`,
      status: randomStatus,
      user: randomStatus === "occupied" || randomStatus === "pre-booked"
        ? `Student #${Math.floor(Math.random() * 1000) + 1000}`
        : undefined,
      timeRemaining: randomStatus === "pre-booked" ? Math.floor(Math.random() * 120) + 10 : undefined,
    };
  };

  return seatRows;
};
