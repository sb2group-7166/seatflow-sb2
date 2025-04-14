
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Search, 
  ArrowUpDown, 
  MoreHorizontal,
  UserPlus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StudentTableProps {
  className?: string;
}

// Mock data for students
const students = [
  {
    id: "STU1001",
    name: "Alex Johnson",
    email: "alex.j@example.edu",
    registeredOn: "2023-09-15",
    status: "active",
    lastActive: "10 mins ago",
    photo: "/placeholder.svg",
    idProof: "ID12345",
    bookings: 28,
    violations: 0,
    phone: "+1 555-123-4567",
    address: "123 Campus Drive, University Housing Block A",
  },
  {
    id: "STU1002",
    name: "Samantha Lee",
    email: "slee@example.edu",
    registeredOn: "2023-08-22",
    status: "active",
    lastActive: "2 hours ago",
    photo: "/placeholder.svg",
    idProof: "ID12346",
    bookings: 15,
    violations: 1,
    phone: "+1 555-987-6543",
    address: "456 University Ave, Apartment 2B",
  },
  {
    id: "STU1003",
    name: "David Martinez",
    email: "dmartinez@example.edu",
    registeredOn: "2023-10-05",
    status: "banned",
    lastActive: "3 days ago",
    photo: "/placeholder.svg",
    idProof: "ID12347",
    bookings: 32,
    violations: 3,
    phone: "+1 555-456-7890",
    address: "789 College Blvd, Dorm 3C",
  },
  {
    id: "STU1004",
    name: "Priya Patel",
    email: "ppatel@example.edu",
    registeredOn: "2023-07-30",
    status: "pending",
    lastActive: "Just now",
    photo: "/placeholder.svg",
    idProof: "ID12348",
    bookings: 5,
    violations: 0,
    phone: "+1 555-234-5678",
    address: "101 Study Lane, Housing Complex D",
  },
  {
    id: "STU1005",
    name: "Michael Wong",
    email: "mwong@example.edu",
    registeredOn: "2023-09-02",
    status: "active",
    lastActive: "5 hours ago",
    photo: "/placeholder.svg",
    idProof: "ID12349",
    bookings: 17,
    violations: 1,
    phone: "+1 555-876-5432",
    address: "202 Academia Road, Apartment 4A",
  }
];

const StudentTable = ({ className }: StudentTableProps) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Student Data</CardTitle>
            <CardDescription>Complete student information</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full sm:w-[200px] pl-8"
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <Collapsible
                key={student.id}
                open={expandedStudent === student.id}
                onOpenChange={() => toggleExpand(student.id)}
                className="w-full"
              >
                <TableRow>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                        <img 
                          src={student.photo} 
                          alt={student.name}
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        {student.name}
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active" 
                          ? "default" 
                          : student.status === "banned" 
                            ? "destructive" 
                            : "outline"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Details
                          {expandedStudent === student.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                <CollapsibleContent>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{student.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            <p className="text-sm font-medium">{student.address}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ID Proof</p>
                            <p className="text-sm font-medium">{student.idProof}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Registration Date</p>
                            <p className="text-sm font-medium">{student.registeredOn}</p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Bookings</p>
                              <p className="text-sm font-medium">{student.bookings}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Violations</p>
                              <p className="text-sm font-medium">{student.violations}</p>
                            </div>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <Button size="sm">Edit</Button>
                            <Button size="sm" variant="outline">View History</Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;
