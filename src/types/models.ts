
// Common interfaces and types for the application

import { 
  Student, 
  Seat, 
  SeatStatus, 
  SeatZone, 
  Shift,
  Payment,
  PaymentStatus,
  PaymentType,
  Notification,
  NotificationType,
  OccupancyData,
  RevenueData,
  StudentUsageData
} from '../api';

// Re-export all types
export type {
  Student,
  Seat,
  SeatStatus,
  SeatZone,
  Shift,
  Payment,
  PaymentStatus,
  PaymentType,
  Notification,
  NotificationType,
  OccupancyData,
  RevenueData,
  StudentUsageData
};

// Additional types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'librarian' | 'student';
  avatar?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface LibrarySettings {
  name: string;
  openingTime: string;
  closingTime: string;
  maxStudentsPerShift: number;
  bookingAdvanceDays: number;
  cancellationPeriodMinutes: number;
  finePerLateMinute: number;
}
