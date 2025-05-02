import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Student, StudentStats, NewStudent } from '@/models/student';
import { handleApiResponse } from '@/api/axios';
import api from '@/api/axios';

// Define the state type
interface StudentState {
  students: Student[];
  stats: StudentStats;
  selectedStudent: Student | null;
  isLoading: boolean;
  error: string | null;
}

// Define action types
type StudentAction =
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_STATS'; payload: StudentStats }
  | { type: 'SET_SELECTED_STUDENT'; payload: Student | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string };

// Initial state
const initialState: StudentState = {
  students: [],
  stats: {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalBookings: 0,
    totalViolations: 0,
    totalDues: 0
  },
  selectedStudent: null,
  isLoading: false,
  error: null
};

// Reducer function
const studentReducer = (state: StudentState, action: StudentAction): StudentState => {
  switch (action.type) {
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_SELECTED_STUDENT':
      return { ...state, selectedStudent: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? action.payload : student
        )
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(student => student.id !== action.payload)
      };
    default:
      return state;
  }
};

// Create context
const StudentContext = createContext<{
  state: StudentState;
  dispatch: React.Dispatch<StudentAction>;
  fetchStudents: () => Promise<void>;
  fetchStudentStats: () => Promise<void>;
  addStudent: (student: NewStudent) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
} | undefined>(undefined);

// Provider component
export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const students = await handleApiResponse<Student[]>(api.get('/students'));
      dispatch({ type: 'SET_STUDENTS', payload: students });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch student stats
  const fetchStudentStats = async () => {
    try {
      const stats = await handleApiResponse<StudentStats>(api.get('/students/stats'));
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Add new student
  const addStudent = async (student: NewStudent) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newStudent = await handleApiResponse<Student>(api.post('/students', student));
      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update student
  const updateStudent = async (student: Student) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedStudent = await handleApiResponse<Student>(
        api.put(`/students/${student.id}`, student)
      );
      dispatch({ type: 'UPDATE_STUDENT', payload: updatedStudent });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete student
  const deleteStudent = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await handleApiResponse(api.delete(`/students/${id}`));
      dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchStudentStats();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        state,
        dispatch,
        fetchStudents,
        fetchStudentStats,
        addStudent,
        updateStudent,
        deleteStudent
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook for using the context
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}; 