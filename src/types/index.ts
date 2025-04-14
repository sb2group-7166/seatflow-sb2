
// Export all types
export * from './models';

// Additional types for the application
export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  user?: string;
  timeRemaining?: number;
}

export type SeatStatus = "available" | "occupied" | "reserved" | "maintenance";
