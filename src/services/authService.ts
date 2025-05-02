import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  async signIn(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  async signUp(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  async signOut() {
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
}; 