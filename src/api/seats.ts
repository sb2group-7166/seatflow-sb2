
// Seats API Service

import { toast } from "sonner";

export type SeatStatus = "available" | "occupied" | "reserved" | "maintenance";
export type SeatZone = "full-day" | "half-day";

export interface Seat {
  id: string;
  number: string;
  zone: SeatZone;
  floor: number;
  status: SeatStatus;
  currentOccupant?: string;
  reservedBy?: string;
  reservationStart?: string;
  reservationEnd?: string;
}

// Mock data
const mockSeats: Seat[] = [
  { id: "1", number: "F101", zone: "full-day", floor: 1, status: "available" },
  { id: "2", number: "F102", zone: "full-day", floor: 1, status: "occupied", currentOccupant: "1" },
  { id: "3", number: "F103", zone: "full-day", floor: 1, status: "reserved", reservedBy: "2" },
  { id: "4", number: "H201", zone: "half-day", floor: 2, status: "available" },
  { id: "5", number: "H202", zone: "half-day", floor: 2, status: "maintenance" },
  { id: "6", number: "F301", zone: "full-day", floor: 3, status: "available" },
  { id: "7", number: "H302", zone: "half-day", floor: 3, status: "occupied", currentOccupant: "3" },
  { id: "8", number: "F401", zone: "full-day", floor: 4, status: "available" },
  { id: "9", number: "H402", zone: "half-day", floor: 4, status: "occupied", currentOccupant: "4" },
  { id: "10", number: "H403", zone: "half-day", floor: 4, status: "reserved", reservedBy: "5" },
];

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

// Get seats by zone
export const getSeatsByZone = async (zone: SeatZone): Promise<Seat[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeats.filter(seat => seat.zone === zone);
  } catch (error) {
    toast.error("Failed to fetch seats for this zone");
    console.error("Error fetching seats by zone:", error);
    return [];
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
