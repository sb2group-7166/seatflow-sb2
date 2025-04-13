
// Notifications API Service

import { toast } from "sonner";

export type NotificationType = 
  | "booking-confirmation" 
  | "shift-reminder" 
  | "payment-reminder" 
  | "system-alert"
  | "fine-notice";

export interface Notification {
  id: string;
  recipientId: string;
  recipientName?: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    recipientId: "1",
    recipientName: "James Wilson",
    title: "Seat Booking Confirmed",
    message: "Your seat A102 has been reserved for tomorrow from 8:00 AM to 1:00 PM.",
    type: "booking-confirmation",
    timestamp: "2023-12-01T14:30:00",
    isRead: true,
    action: {
      label: "View Booking",
      url: "/seats"
    }
  },
  {
    id: "2",
    recipientId: "2",
    recipientName: "Sarah Johnson",
    title: "Shift Change Reminder",
    message: "Your current shift ends in 30 minutes. Please prepare to leave the seat.",
    type: "shift-reminder",
    timestamp: "2023-12-02T12:30:00",
    isRead: false
  },
  {
    id: "3",
    recipientId: "3",
    recipientName: "Michael Brown",
    title: "Payment Due",
    message: "You have an outstanding payment of $15.00 for seat reservation.",
    type: "payment-reminder",
    timestamp: "2023-12-01T10:15:00",
    isRead: false,
    action: {
      label: "Make Payment",
      url: "/payments"
    }
  },
  {
    id: "4",
    recipientId: "4",
    recipientName: "Emma Davis",
    title: "Library Closing Early",
    message: "Due to maintenance, the library will close at 7:00 PM today.",
    type: "system-alert",
    timestamp: "2023-12-01T09:00:00",
    isRead: true
  },
  {
    id: "5",
    recipientId: "5",
    recipientName: "Robert Garcia",
    title: "Late Return Fine",
    message: "A fine of $10 has been applied for the late vacating of seat B201.",
    type: "fine-notice",
    timestamp: "2023-11-30T18:45:00",
    isRead: false,
    action: {
      label: "Pay Fine",
      url: "/payments"
    }
  },
];

// Get all notifications (admin view)
export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockNotifications;
  } catch (error) {
    toast.error("Failed to fetch notifications");
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockNotifications.filter(notification => notification.recipientId === userId);
  } catch (error) {
    toast.error("Failed to fetch user notifications");
    console.error("Error fetching user notifications:", error);
    return [];
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications.filter(n => n.recipientId === userId && !n.isRead).length;
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0;
  }
};

// Send notification
export const sendNotification = async (
  notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
): Promise<Notification | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newNotification: Notification = {
      ...notification,
      id: `${mockNotifications.length + 1}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    toast.success("Notification sent successfully");
    return newNotification;
  } catch (error) {
    toast.error("Failed to send notification");
    console.error("Error sending notification:", error);
    return null;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Send bulk notifications
export const sendBulkNotifications = async (
  recipientIds: string[],
  notificationData: Omit<Notification, 'id' | 'recipientId' | 'timestamp' | 'isRead'>
): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Notifications sent to ${recipientIds.length} recipients`);
    return true;
  } catch (error) {
    toast.error("Failed to send bulk notifications");
    console.error("Error sending bulk notifications:", error);
    return false;
  }
};
