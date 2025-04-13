
import React, { createContext, useContext, ReactNode } from 'react';
import * as api from '../api';

// Create a context for API services
interface ApiContextType {
  students: typeof api;
  seats: typeof api;
  shifts: typeof api;
  payments: typeof api;
  notifications: typeof api;
  reports: typeof api;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // You can add authentication, error handling, or other API-related logic here
  
  const value = {
    students: api,
    seats: api,
    shifts: api,
    payments: api,
    notifications: api,
    reports: api,
  };
  
  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

// Hook for using the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Export individual API hooks for better developer experience
export const useStudentsApi = () => useApi().students;
export const useSeatsApi = () => useApi().seats;
export const useShiftsApi = () => useApi().shifts;
export const usePaymentsApi = () => useApi().payments;
export const useNotificationsApi = () => useApi().notifications;
export const useReportsApi = () => useApi().reports;
