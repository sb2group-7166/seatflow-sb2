import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiResponse } from '@/api/axios';
import api from '@/api/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const user = await handleApiResponse<User>(api.get('/auth/me'));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      navigate('/dashboard');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      navigate('/dashboard');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 