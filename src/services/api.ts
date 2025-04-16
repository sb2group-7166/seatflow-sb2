import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export const seatService = {
  getAllSeats: async (params?: any) => {
    const response = await api.get('/seats', { params });
    return response.data;
  },
  getSeatById: async (id: string) => {
    const response = await api.get(`/seats/${id}`);
    return response.data;
  },
  createSeat: async (seatData: any) => {
    const response = await api.post('/seats', seatData);
    return response.data;
  },
  updateSeat: async (id: string, seatData: any) => {
    const response = await api.put(`/seats/${id}`, seatData);
    return response.data;
  },
  deleteSeat: async (id: string) => {
    const response = await api.delete(`/seats/${id}`);
    return response.data;
  },
  getSeatAvailability: async (id: string, startTime: string, endTime: string) => {
    const response = await api.get(`/seats/${id}/availability`, {
      params: { startTime, endTime }
    });
    return response.data;
  },
  updateSeatStatus: async (id: string, status: string) => {
    const response = await api.put(`/seats/${id}/status`, { status });
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getAllBookings: async (params?: any) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  getUserBookings: async (params?: any) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },
  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
  cancelBooking: async (id: string) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};

export const studentService = {
  getStudents: async (params?: any) => {
    const response = await api.get('/students', { params });
    return response.data;
  },
  getStudentById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  createStudent: async (studentData: FormData) => {
    const response = await api.post('/students', studentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateStudent: async (id: string, studentData: FormData) => {
    const response = await api.put(`/students/${id}`, studentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteStudent: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  updateStudentStatus: async (id: string, status: string) => {
    const response = await api.put(`/students/${id}/status`, { status });
    return response.data;
  },
};

export default api; 