export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  profileImage?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seat {
  id: string;
  number: string;
  occupancy: number;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  seats: Seat[];
}

export interface Booking {
  id: string;
  studentId: string;
  seatId: string;
  startTime: string;
  endTime: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}

export interface DashboardStats {
  totalSeats: number;
  availableSeats: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  zoneOccupancy: {
    zoneId: string;
    zoneName: string;
    occupancy: number;
  }[];
} 