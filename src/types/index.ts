// Export all types
export * from './models';

// Additional types for the application
export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  student?: Student;
}

export type SeatStatus = 'available' | 'occupied' | 'pre-booked';

// Updated SeatZone to match the expected values in shifts.ts
export type SeatZone = "full-day" | "half-day" | "reading-area" | "computer-zone" | "quiet-study" | "group-study";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  fatherName: string;
  admissionDate: string;
  idProof: string;
  idProofPhoto?: string;
  address: string;
  status: string;
  shiftTiming?: string;
  shiftDays?: string;
  studyCenter?: string;
  feePaymentDueDate?: string;
}
