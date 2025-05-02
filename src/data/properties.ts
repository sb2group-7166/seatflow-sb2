import { Library, BookOpen, School } from "lucide-react";

export interface Property {
  id: string;
  name: string;
  displayName: string;
  logo: any;
  logoColor: string;
  location: string;
  seats: number;
  students: number;
  revenue: number;
}

export const properties: Property[] = [
  { 
    id: "sb2", 
    name: "SB2 Library", 
    displayName: "SB2",
    logo: Library,
    logoColor: "text-blue-600",
    location: "123 Main Street",
    seats: 98,
    students: 120,
    revenue: 75000
  },
  { 
    id: "sb1", 
    name: "SB1 Library", 
    displayName: "SB1",
    logo: BookOpen,
    logoColor: "text-green-600",
    location: "456 Oak Avenue",
    seats: 75,
    students: 90,
    revenue: 60000
  },
  { 
    id: "main", 
    name: "Main Library", 
    displayName: "Main",
    logo: School,
    logoColor: "text-purple-600",
    location: "789 Pine Road",
    seats: 150,
    students: 180,
    revenue: 120000
  },
]; 