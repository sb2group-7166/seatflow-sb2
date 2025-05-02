import { api } from '@/lib/api';

export interface AttendanceRecord {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
  activities: {
    type: 'check-in' | 'check-out';
    timestamp: string;
    location?: string;
  }[];
  notes?: string;
}

export const attendanceService = {
  async recordAttendance(data: {
    studentId: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    notes?: string;
  }) {
    const response = await api.post('/attendance/record', data);
    return response.data;
  },

  async recordActivity(data: {
    studentId: string;
    type: 'check-in' | 'check-out';
    location?: string;
  }) {
    const response = await api.post('/attendance/activity', data);
    return response.data;
  },

  async getStudentAttendance(studentId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/attendance/student/${studentId}?${params.toString()}`);
    return response.data;
  },

  async getAttendanceStats(studentId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/attendance/stats/${studentId}?${params.toString()}`);
    return response.data;
  },
}; 