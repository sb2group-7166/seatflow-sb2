import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Add token to headers if it exists
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          toast({
            title: "Session Expired",
            description: "Please login again to continue.",
            variant: "destructive",
          });
          break;
        case 403:
          // Forbidden
          toast({
            title: "Access Denied",
            description: "You don't have permission to perform this action.",
            variant: "destructive",
          });
          break;
        case 404:
          // Not Found
          toast({
            title: "Not Found",
            description: "The requested resource was not found.",
            variant: "destructive",
          });
          break;
        case 500:
          // Server Error
          toast({
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later.",
            variant: "destructive",
          });
          break;
        default:
          // Other errors
          toast({
            title: "Error",
            description: error.response.data?.message || "An error occurred",
            variant: "destructive",
          });
      }
    } else if (error.request) {
      // Request was made but no response received
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } else {
      // Something happened in setting up the request
      toast({
        title: "Error",
        description: "An error occurred while setting up the request.",
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

// Type-safe API response wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Type-safe API error
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Helper function to handle API responses
export const handleApiResponse = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
  try {
    const response = await promise;
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data as ApiError;
    }
    throw error;
  }
};

export default api; 