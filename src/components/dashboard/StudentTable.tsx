
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
  UserPlus 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    year: "3rd Year",
    lastActive: "10 mins ago",
  },
  {
    id: "STU1002",
    name: "Samantha Lee",
    email: "slee@example.edu",
    registeredOn: "2023-08-22",
    status: "active",
    year: "2nd Year",
    lastActive: "2 hours ago",
  },
  {
    id: "STU1003",
    name: "David Martinez",
    email: "dmartinez@example.edu",
    registeredOn: "2023-10-05",
    status: "banned",
    year: "1st Year",
    lastActive: "3 days ago",
  },
  {
    id: "STU1004",
    name: "Priya Patel",
    email: "ppatel@example.edu",
    registeredOn: "2023-07-30",
    status: "pending",
    year: "4th Year",
    lastActive: "Just now",
  },
  {
    id: "STU1005",
    name: "Michael Wong",
    email: "mwong@example.edu",
    registeredOn: "2023-09-02",
    status: "active",
    year: "2nd Year",
    lastActive: "5 hours ago",
  }
];

const StudentTable = ({ className }: StudentTableProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Manage registered students</CardDescription>
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
              <TableHead className="hidden md:table-cell">Year</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>
                  <div>
                    {student.name}
                    <p className="text-sm text-muted-foreground">{student.email}</p>
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
                <TableCell className="hidden md:table-cell">{student.year}</TableCell>
                <TableCell className="hidden md:table-cell">{student.lastActive}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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
