
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PencilLine, 
  Plus, 
  ClockIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShiftScheduleProps {
  className?: string;
}

// Mock data for shifts
const shifts = [
  {
    id: "shift-1",
    name: "Morning",
    timeRange: "8:00 AM - 1:00 PM",
    capacity: "120 seats",
    currentOccupancy: "85 seats (71%)",
    status: "active",
    staffAssigned: 3,
  },
  {
    id: "shift-2",
    name: "Afternoon",
    timeRange: "1:00 PM - 6:00 PM",
    capacity: "120 seats",
    currentOccupancy: "98 seats (82%)",
    status: "active",
    staffAssigned: 4,
  },
  {
    id: "shift-3",
    name: "Evening",
    timeRange: "6:00 PM - 11:00 PM",
    capacity: "90 seats",
    currentOccupancy: "78 seats (87%)",
    status: "active",
    staffAssigned: 3,
  },
  {
    id: "shift-4",
    name: "Weekend Extended",
    timeRange: "10:00 AM - 8:00 PM",
    capacity: "150 seats",
    currentOccupancy: "0 seats (0%)",
    status: "inactive",
    staffAssigned: 5,
  },
];

const ShiftSchedule = ({ className }: ShiftScheduleProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Shift Management</CardTitle>
            <CardDescription>Configure library operating shifts</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Shift
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Time Range</TableHead>
              <TableHead className="hidden md:table-cell">Capacity</TableHead>
              <TableHead className="hidden md:table-cell">Current Occupancy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    {shift.name}
                  </div>
                </TableCell>
                <TableCell>{shift.timeRange}</TableCell>
                <TableCell className="hidden md:table-cell">{shift.capacity}</TableCell>
                <TableCell className="hidden md:table-cell">{shift.currentOccupancy}</TableCell>
                <TableCell>
                  <Badge
                    variant={shift.status === "active" ? "default" : "outline"}
                  >
                    {shift.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <PencilLine className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-md">
          <h4 className="font-medium mb-2">Auto Seat Reallocation</h4>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <Button variant="secondary" size="sm">
              Reallocate Morning → Afternoon
            </Button>
            <Button variant="secondary" size="sm">
              Reallocate Afternoon → Evening
            </Button>
            <Button variant="outline" size="sm">
              Configure Auto-Reallocation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftSchedule;
