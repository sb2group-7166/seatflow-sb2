
// Payments API Service

import { toast } from "sonner";

export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";
export type PaymentType = "seat-reservation" | "fine" | "membership" | "other";

export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  date: string;
  reference?: string;
  description?: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "James Wilson",
    amount: 25,
    type: "seat-reservation",
    status: "completed",
    date: "2023-12-01",
    reference: "PAY-SB2-001"
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Sarah Johnson",
    amount: 15,
    type: "fine",
    status: "pending",
    date: "2023-12-02",
    reference: "PAY-SB2-002"
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Michael Brown",
    amount: 50,
    type: "membership",
    status: "completed",
    date: "2023-11-28",
    reference: "PAY-SB2-003"
  },
  {
    id: "4",
    studentId: "4",
    studentName: "Emma Davis",
    amount: 25,
    type: "seat-reservation",
    status: "failed",
    date: "2023-11-30",
    reference: "PAY-SB2-004"
  },
  {
    id: "5",
    studentId: "5",
    studentName: "Robert Garcia",
    amount: 25,
    type: "seat-reservation",
    status: "refunded",
    date: "2023-11-25",
    reference: "PAY-SB2-005",
    description: "Cancelled reservation"
  },
];

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockPayments;
  } catch (error) {
    toast.error("Failed to fetch payments");
    console.error("Error fetching payments:", error);
    return [];
  }
};

// Get payment by ID
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const payment = mockPayments.find(p => p.id === id);
    return payment || null;
  } catch (error) {
    toast.error("Failed to fetch payment details");
    console.error("Error fetching payment:", error);
    return null;
  }
};

// Get payments by student
export const getPaymentsByStudent = async (studentId: string): Promise<Payment[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPayments.filter(payment => payment.studentId === studentId);
  } catch (error) {
    toast.error("Failed to fetch student payments");
    console.error("Error fetching payments by student:", error);
    return [];
  }
};

// Create payment
export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPayment: Payment = {
      ...payment,
      id: `${mockPayments.length + 1}`,
    };
    
    toast.success("Payment created successfully");
    return newPayment;
  } catch (error) {
    toast.error("Failed to create payment");
    console.error("Error creating payment:", error);
    return null;
  }
};

// Process refund
export const processRefund = async (paymentId: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    toast.success("Refund processed successfully");
    return true;
  } catch (error) {
    toast.error("Failed to process refund");
    console.error("Error processing refund:", error);
    return false;
  }
};

// Get payment statistics
export const getPaymentStats = async (): Promise<{
  totalRevenue: number;
  pendingPayments: number;
  refundedAmount: number;
}> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalRevenue: 2450,
      pendingPayments: 3,
      refundedAmount: 125
    };
  } catch (error) {
    toast.error("Failed to fetch payment statistics");
    console.error("Error fetching payment stats:", error);
    return {
      totalRevenue: 0,
      pendingPayments: 0,
      refundedAmount: 0
    };
  }
};
