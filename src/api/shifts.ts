
// Shifts API Service

import { toast } from "sonner";

export type SeatZone = "full-day" | "half-day" | "reading-area" | "computer-zone" | "quiet-study" | "group-study";

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  date?: string;
  capacity: number;
  zone: SeatZone;
  currentOccupancy?: number;
  staffAssigned?: string[];
}

// Mock data
const mockShifts: Shift[] = [
  {
    id: "1",
    name: "Morning Shift",
    startTime: "07:00",
    endTime: "14:00",
    capacity: 98,
    zone: "full-day",
    currentOccupancy: 0,
    staffAssigned: ["Staff 1", "Staff 2", "Staff 3"]
  },
  {
    id: "2",
    name: "Full Day Shift",
    startTime: "14:00",
    endTime: "22:00",
    capacity: 98,
    zone: "full-day",
    currentOccupancy: 0,
    staffAssigned: ["Staff 4", "Staff 5", "Staff 6"]
  },
  {
    id: "3",
    name: "Evening Shift",
    startTime: "18:00",
    endTime: "22:00",
    capacity: 98,
    zone: "full-day",
    currentOccupancy: 0,
    staffAssigned: ["Staff 7", "Staff 8"]
  },
  {
    id: "4",
    name: "Late Evening Shift",
    startTime: "14:00",
    endTime: "00:00",
    capacity: 98,
    zone: "half-day",
    currentOccupancy: 0,
    staffAssigned: ["Staff 9"]
  },
  {
    id: "5",
    name: "Late Night Shift",
    startTime: "07:00",
    endTime: "00:00",
    capacity: 98,
    zone: "half-day",
    currentOccupancy: 0,
    staffAssigned: ["Staff 10"]
  }
];

// Get all shifts
export const getAllShifts = async (): Promise<Shift[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockShifts;
  } catch (error) {
    toast.error("Failed to fetch shifts");
    console.error("Error fetching shifts:", error);
    return [];
  }
};

// Get shift by ID
export const getShiftById = async (id: string): Promise<Shift | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const shift = mockShifts.find(s => s.id === id);
    return shift || null;
  } catch (error) {
    toast.error("Failed to fetch shift details");
    console.error("Error fetching shift:", error);
    return null;
  }
};

// Get shifts by zone
export const getShiftsByZone = async (zone: SeatZone): Promise<Shift[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockShifts.filter(shift => shift.zone === zone);
  } catch (error) {
    toast.error("Failed to fetch shifts for this zone");
    console.error("Error fetching shifts by zone:", error);
    return [];
  }
};

// Get shifts by date
export const getShiftsByDate = async (date: string): Promise<Shift[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    // In a real implementation, you would filter by date
    return mockShifts;
  } catch (error) {
    toast.error("Failed to fetch shifts for this date");
    console.error("Error fetching shifts by date:", error);
    return [];
  }
};

// Create shift
export const createShift = async (shift: Omit<Shift, 'id'>): Promise<Shift | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newShift: Shift = {
      ...shift,
      id: `${mockShifts.length + 1}`,
    };
    
    toast.success("Shift created successfully");
    return newShift;
  } catch (error) {
    toast.error("Failed to create shift");
    console.error("Error creating shift:", error);
    return null;
  }
};

// Update shift
export const updateShift = async (id: string, data: Partial<Shift>): Promise<Shift | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const shift = mockShifts.find(s => s.id === id);
    if (!shift) return null;
    
    const updatedShift = { ...shift, ...data };
    toast.success("Shift updated successfully");
    return updatedShift;
  } catch (error) {
    toast.error("Failed to update shift");
    console.error("Error updating shift:", error);
    return null;
  }
};

// Delete shift
export const deleteShift = async (id: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    toast.success("Shift deleted successfully");
    return true;
  } catch (error) {
    toast.error("Failed to delete shift");
    console.error("Error deleting shift:", error);
    return false;
  }
};

// Assign staff to shift
export const assignStaffToShift = async (shiftId: string, staffIds: string[]): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    toast.success("Staff assigned successfully");
    return true;
  } catch (error) {
    toast.error("Failed to assign staff");
    console.error("Error assigning staff:", error);
    return false;
  }
};

