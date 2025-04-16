// Student API Service
import { toast } from "sonner";

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

// API endpoints configuration
const API_BASE_URL = "/api/students";

// Get all students
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch students");
    return await response.json();
  } catch (error) {
    toast.error("Failed to fetch students");
    console.error("Error fetching students:", error);
    return [];
  }
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Student not found");
    return await response.json();
  } catch (error) {
    toast.error("Failed to fetch student details");
    console.error("Error fetching student:", error);
    return null;
  }
};

// Create student
export const createStudent = async (
  student: Omit<Student, 'id'>
): Promise<Student | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) throw new Error("Creation failed");
    
    const newStudent = await response.json();
    toast.success("Student created successfully");
    return newStudent;
  } catch (error) {
    toast.error("Failed to create student");
    console.error("Error creating student:", error);
    return null;
  }
};

// Update student
export const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<Student | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Update failed");
    
    const updatedStudent = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Deletion failed");
    
    toast.success("Student deleted successfully");
    return true;
  } catch (error) {
    toast.error("Failed to delete student");
    console.error("Error deleting student:", error);
    return false;
  }
};