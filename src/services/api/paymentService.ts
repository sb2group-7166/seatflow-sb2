import { api } from './api';

interface Payment {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  description: string;
  invoiceUrl: string;
}

interface ReportParams {
  startDate: string;
  endDate: string;
}

export const paymentService = {
  async generateReport(params: ReportParams): Promise<void> {
    await api.post('/payments/report', params);
  },

  async exportPayments(format: 'csv' | 'pdf'): Promise<void> {
    await api.get(`/payments/export/${format}`);
  },

  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/payments');
    return response.data;
  },

  async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    await api.patch(`/payments/${paymentId}/status`, { status });
  }
}; 