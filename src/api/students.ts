
// Student API Service

import { toast } from "sonner";

// Student interface
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  joinDate: string;
  status: "active" | "suspended" | "graduated";
  contactNumber?: string;
  photo?: string;
}

// Mock data - replace with actual API calls when backend is connected
const mockStudents: Student[] = [
  {
    id: "1",
    name: "James Wilson",
    email: "james.wilson@example.com",
    studentId: "SB2001",
    joinDate: "2023-01-15",
    status: "active",
    contactNumber: "555-1234",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    studentId: "SB2002",
    joinDate: "2023-02-10",
    status: "active",
    contactNumber: "555-5678",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    studentId: "SB2003",
    joinDate: "2023-01-20",
    status: "suspended",
    contactNumber: "555-9012",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    studentId: "SB2004",
    joinDate: "2023-03-05",
    status: "active",
    contactNumber: "555-3456",
  },
  {
    id: "5",
    name: "Robert Garcia",
    email: "robert.g@example.com",
    studentId: "SB2005",
    joinDate: "2023-02-25",
    status: "graduated",
    contactNumber: "555-7890",
  }
];

// Get all students
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents;
  } catch (error) {
    toast.error("Failed to fetch students");
    console.error("Error fetching students:", error);
    return [];
  }
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const student = mockStudents.find(s => s.id === id);
    return student || null;
  } catch (error) {
    toast.error("Failed to fetch student details");
    console.error("Error fetching student:", error);
    return null;
  }
};

// Create student
export const createStudent = async (student: Omit<Student, 'id'>): Promise<Student | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newStudent: Student = {
      ...student,
      id: `${mockStudents.length + 1}`,
    };
    
    toast.success("Student created successfully");
    return newStudent;
  } catch (error) {
    toast.error("Failed to create student");
    console.error("Error creating student:", error);
    return null;
  }
};

// Update student
export const updateStudent = async (id: string, data: Partial<Student>): Promise<Student | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const student = mockStudents.find(s => s.id === id);
    if (!student) return null;
    
    const updatedStudent = { ...student, ...data };
    toast.success("Student updated successfully");
    return updatedStudent;
  } catch (error) {
    toast.error("Failed to update student");
    console.error("Error updating student:", error);
    return null;
  }
};

// Delete student
export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    toast.success("Student deleted successfully");
    return true;
  } catch (error) {
    toast.error("Failed to delete student");
    console.error("Error deleting student:", error);
    return false;
  }
};
