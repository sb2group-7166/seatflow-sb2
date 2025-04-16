// Reports API Service

import { toast } from "sonner";

export interface OccupancyData {
  date: string;
  total: number;
  zone: {
    readingArea: number;
    computerZone: number;
    quietStudy: number;
    groupStudy: number;
  };
}

export interface RevenueData {
  date: string;
  amount: number;
  type: {
    seatReservation: number;
    fines: number;
    membership: number;
    other: number;
  };
}

export interface StudentUsageData {
  studentId: string;
  studentName: string;
  totalHours: number;
  visitsCount: number;
  lastVisit: string;
  preferredZone?: string;
}

// Mock data
const mockOccupancyData: OccupancyData[] = [
  {
    date: "2023-11-01",
    total: 140,
    zone: {
      readingArea: 60,
      computerZone: 40,
      quietStudy: 25,
      groupStudy: 15
    }
  },
  {
    date: "2023-11-02",
    total: 165,
    zone: {
      readingArea: 70,
      computerZone: 45,
      quietStudy: 30,
      groupStudy: 20
    }
  },
  {
    date: "2023-11-03",
    total: 180,
    zone: {
      readingArea: 75,
      computerZone: 50,
      quietStudy: 35,
      groupStudy: 20
    }
  },
  {
    date: "2023-11-04",
    total: 190,
    zone: {
      readingArea: 80,
      computerZone: 50,
      quietStudy: 35,
      groupStudy: 25
    }
  },
  {
    date: "2023-11-05",
    total: 150,
    zone: {
      readingArea: 65,
      computerZone: 40,
      quietStudy: 30,
      groupStudy: 15
    }
  },
  {
    date: "2023-11-06",
    total: 130,
    zone: {
      readingArea: 55,
      computerZone: 35,
      quietStudy: 25,
      groupStudy: 15
    }
  },
  {
    date: "2023-11-07",
    total: 145,
    zone: {
      readingArea: 60,
      computerZone: 40,
      quietStudy: 30,
      groupStudy: 15
    }
  }
];

const mockRevenueData: RevenueData[] = [
  {
    date: "2023-11-01",
    amount: 450,
    type: {
      seatReservation: 300,
      fines: 50,
      membership: 100,
      other: 0
    }
  },
  {
    date: "2023-11-02",
    amount: 520,
    type: {
      seatReservation: 350,
      fines: 70,
      membership: 100,
      other: 0
    }
  },
  {
    date: "2023-11-03",
    amount: 580,
    type: {
      seatReservation: 400,
      fines: 30,
      membership: 150,
      other: 0
    }
  },
  {
    date: "2023-11-04",
    amount: 600,
    type: {
      seatReservation: 420,
      fines: 80,
      membership: 100,
      other: 0
    }
  },
  {
    date: "2023-11-05",
    amount: 480,
    type: {
      seatReservation: 330,
      fines: 50,
      membership: 100,
      other: 0
    }
  },
  {
    date: "2023-11-06",
    amount: 420,
    type: {
      seatReservation: 280,
      fines: 40,
      membership: 100,
      other: 0
    }
  },
  {
    date: "2023-11-07",
    amount: 470,
    type: {
      seatReservation: 320,
      fines: 50,
      membership: 100,
      other: 0
    }
  }
];

// Get occupancy data
export const getOccupancyData = async (startDate?: string, endDate?: string): Promise<OccupancyData[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockOccupancyData;
  } catch (error) {
    toast.error("Failed to fetch occupancy data");
    console.error("Error fetching occupancy data:", error);
    return [];
  }
};

// Get revenue data
export const getRevenueData = async (startDate?: string, endDate?: string): Promise<RevenueData[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockRevenueData;
  } catch (error) {
    toast.error("Failed to fetch revenue data");
    console.error("Error fetching revenue data:", error);
    return [];
  }
};

// Get daily summary report
export const getDailySummary = async (date?: string): Promise<{
  totalStudents: number;
  peakHour: string;
  totalRevenue: number;
  occupancyRate: number;
}> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalStudents: 185,
      peakHour: "2PM - 3PM",
      totalRevenue: 520,
      occupancyRate: 78.5
    };
  } catch (error) {
    toast.error("Failed to fetch daily summary");
    console.error("Error fetching daily summary:", error);
    return {
      totalStudents: 0,
      peakHour: "N/A",
      totalRevenue: 0,
      occupancyRate: 0
    };
  }
};

// Get student usage data
export const getStudentUsageData = async (): Promise<StudentUsageData[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return [
      {
        studentId: "1",
        studentName: "James Wilson",
        totalHours: 45,
        visitsCount: 12,
        lastVisit: "2023-12-01",
        preferredZone: "reading-area"
      },
      {
        studentId: "2",
        studentName: "Sarah Johnson",
        totalHours: 32,
        visitsCount: 8,
        lastVisit: "2023-11-29",
        preferredZone: "quiet-study"
      },
      {
        studentId: "3",
        studentName: "Michael Brown",
        totalHours: 28,
        visitsCount: 7,
        lastVisit: "2023-11-30",
        preferredZone: "computer-zone"
      },
      {
        studentId: "4",
        studentName: "Emma Davis",
        totalHours: 36,
        visitsCount: 9,
        lastVisit: "2023-12-01",
        preferredZone: "reading-area"
      },
      {
        studentId: "5",
        studentName: "Robert Garcia",
        totalHours: 20,
        visitsCount: 5,
        lastVisit: "2023-11-28",
        preferredZone: "group-study"
      }
    ];
  } catch (error) {
    toast.error("Failed to fetch student usage data");
    console.error("Error fetching student usage data:", error);
    return [];
  }
};

// Generate custom report
export const generateCustomReport = async (
  reportType: string,
  startDate: string,
  endDate: string,
  filters: Record<string, string | number | boolean | string[]>
): Promise<string> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Report generated successfully");
    
    // In a real implementation, this might return a URL to the generated report
    return "https://example.com/reports/generated-report-123.pdf";
  } catch (error) {
    toast.error("Failed to generate report");
    console.error("Error generating report:", error);
    return "";
  }
};
