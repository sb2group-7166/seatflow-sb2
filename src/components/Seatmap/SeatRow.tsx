// Seats API Service

import { toast } from "sonner";

export type SeatStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  floor: number; // Added floor property which was used but not defined in interface
  currentOccupant?: string;
  reservedBy?: string;
  reservationStart?: string;
  reservationEnd?: string;
  // Properties for compatibility with SeatRow component
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
export const formatSeatsForRow = (seats: Seat[], rowNumber: number): {
  leftRowSeats: Seat[];
  rightRowSeats: Seat[];
  rowNumber: number;
} => {
  // Filter seats for current row (1-14)
  const rowSeats = seats.filter(seat => {
    const seatNum = parseInt(seat.number.replace(/[^\d]/g, ''));
    return Math.floor(seatNum / 100) === rowNumber;
  });
  
  // Left side has 3 columns (seats 1-3)
  const leftRowSeats = rowSeats.slice(0, 3);
  
  // Right side has 4 columns (seats 6-9) with 2-seat gap (seats 4-5)
  const rightRowSeats = rowSeats.slice(5, 9);
  
  return {
    leftRowSeats,
    rightRowSeats,
    rowNumber
  };
};

// Get all seats
export const getAllSeats = async (): Promise<Seat[]> => {
  try {
    // Simulate API call
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const seat = mockSeats.find(s => s.id === id);
    return seat || null;
  } catch (error) {
    toast.error("Failed to fetch seat details");
    console.error("Error fetching seat:", error);
    return null;
  }
};

// Get seats by floor
export const getSeatsByFloor = async (floor: number): Promise<Seat[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeats.filter(seat => seat.floor === floor);
  } catch (error) {
    toast.error("Failed to fetch seats for this floor");
    console.error("Error fetching seats by floor:", error);
    return [];
  }
};

// Get available seats
export const getAvailableSeats = async (): Promise<Seat[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeats.filter(seat => seat.status === "available");
  } catch (error) {
    toast.error("Failed to fetch available seats");
    console.error("Error fetching available seats:", error);
    return [];
  }
};

// Reserve seat
export const reserveSeat = async (seatId: string, studentId: string, startTime: string, endTime: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    toast.success("Seat reserved successfully");
    return true;
  } catch (error) {
    toast.error("Failed to reserve seat");
    console.error("Error reserving seat:", error);
    return false;
  }
};

// Release seat
export const releaseSeat = async (seatId: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    toast.success("Seat released successfully");
    return true;
  } catch (error) {
    toast.error("Failed to release seat");
    console.error("Error releasing seat:", error);
    return false;
  }
};

// Mark seat as maintenance
export const markSeatMaintenance = async (seatId: string, isInMaintenance: boolean): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(isInMaintenance ? "Seat marked for maintenance" : "Seat maintenance completed");
    return true;
  } catch (error) {
    toast.error("Failed to update seat maintenance status");
    console.error("Error updating seat maintenance:", error);
    return false;
  }
};