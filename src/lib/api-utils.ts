/**
 * API utility functions for handling errors, formatting requests, etc.
 */

// Define a more specific error type
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Format error response
export const formatErrorResponse = (error: ApiError | unknown): string => {
  const apiError = error as ApiError;
  
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }
  
  if (apiError?.message) {
    return apiError.message;
  }
  
  return 'An unexpected error occurred';
};

// Format date for API requests
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate a unique reference ID
export const generateReferenceId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomStr}`;
};

// Create query string from parameters
export const createQueryString = (params: Record<string, string | number | boolean>): string => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
};

// Parse API response
export const parseApiResponse = <T>(response: unknown): T => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format');
  }
  
  return response as T;
};

// Simulate API delay (for development only)
export const simulateApiDelay = async (minMs: number = 200, maxMs: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};
