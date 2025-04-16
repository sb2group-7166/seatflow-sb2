import { toast } from "sonner";

export type SeatStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  floor: number;
  currentOccupant?: string;
  reservedBy?: string;
  reservationStart?: string;
  reservationEnd?: string;
  user?: string;
  timeRemaining?: number;
}

// Mock data
const mockSeats: Seat[] = [
  { id: "1", number: "F101", floor: 1, status: "available" },
  { id: "2", number: "F102", floor: 1, status: "available" },
  { id: "3", number: "F103", floor: 1, status: "available" },
  { id: "4", number: "H201", floor: 2, status: "available" },
  { id: "5", number: "H202", floor: 2, status: "available" },
  { id: "6", number: "F301", floor: 3, status: "available" },
  { id: "7", number: "H302", floor: 3, status: "available" },
  { id: "8", number: "F401", floor: 4, status: "available" },
  { id: "9", number: "H402", floor: 4, status: "available" },
  { id: "10", number: "H403", floor: 4, status: "available" },
];

// Transform seats to format expected by SeatRow component
export const formatSeatsForRow = (
  seats: Seat[],
  rowNumber: number
): {
  leftRowSeats: Seat[];
  rightRowSeats: Seat[];
  rowNumber: number;
} => {
  const rowSeats = seats.filter(seat =>
    Math.floor(parseInt(seat.number.replace(/[^\d]/g, '')) / 100) === rowNumber
  );

  const leftRowSeats = rowSeats.slice(0, 3);
  const rightRowSeats = rowSeats.slice(3, 7);

  return {
    leftRowSeats,
    rightRowSeats,
    rowNumber
  };
};

// Get all seats
export const getAllSeats = async (): Promise<Seat[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSeats;
  } catch (error) {
    toast.error("Failed to fetch seats");
    console.error("Error fetching seats:", error);
    return [];
  }
};

// Get seat by ID
export const getSeatById = async (id: string): Promise<Seat | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const seat = mockSeats.find(s => s.id === id);
    return seat || null;
  } catch (error) {
    toast.error("Failed to fetch seat details");
    console.error("Error fetching seat:", error);
    return null;
  }
};



export const getAvailableSeats = async (): Promise<Seat[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeats.filter(seat => seat.status === "available");
  } catch (error) {
    toast.error("Failed to fetch available seats");
    console.error("Error fetching available seats:", error);
    return [];
  }
};

// Reserve seat
export const reserveSeat = async (
  seatId: string,
  studentId: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 700));
    toast.success("Seat reserved successfully");
    return true;
  } catch (error) {
    toast.error("Failed to reserve seat");
    console.error("Error reserving seat:", error);
    return false;
  }
};

// Release seat (fixed version)
export const releaseSeat = async (seatId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    toast.success("Seat released successfully");
    return true;
  } catch (error) {
    toast.error("Failed to release seat");
    console.error("Error releasing seat:", error);
    return false;
  }
};