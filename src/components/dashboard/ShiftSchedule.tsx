
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
  ClockIcon, 
  AlertCircle,
  RotateCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ShiftScheduleProps {
  className?: string;
}

// Updated mock data for shifts to align with SeatMap
const shifts = [
  {
    id: "shift-1",
    name: "Morning",
    timeRange: "07:00 AM - 02:00 PM",
    capacity: "120 seats",
    currentOccupancy: "85 seats (71%)",
    status: "active",
    staffAssigned: 3,
  },
  {
    id: "shift-2",
    name: "Evening",
    timeRange: "02:00 PM - 10:00 PM",
    capacity: "120 seats",
    currentOccupancy: "98 seats (82%)",
    status: "active",
    staffAssigned: 4,
  },
  {
    id: "shift-3",
    name: "Late Evening",
    timeRange: "02:00 PM - 12:00 AM",
    capacity: "90 seats",
    currentOccupancy: "78 seats (87%)",
    status: "active",
    staffAssigned: 3,
  },
  {
    id: "shift-4",
    name: "Full Day (12hr)",
    timeRange: "07:00 AM - 10:00 PM",
    capacity: "150 seats",
    currentOccupancy: "120 seats (80%)",
    status: "active",
    staffAssigned: 5,
  },
  {
    id: "shift-5",
    name: "Full Day (17hr)",
    timeRange: "07:00 AM - 12:00 AM",
    capacity: "150 seats",
    currentOccupancy: "0 seats (0%)",
    status: "inactive",
    staffAssigned: 6,
  },
];

const ShiftSchedule = ({ className }: ShiftScheduleProps) => {
  const { toast } = useToast();

  const handleAddNewShift = () => {
    toast({
      title: "New Shift",
      description: "Add new shift form opened.",
    });
  };

  const handleEditShift = (shiftId: string) => {
    toast({
      title: "Edit Shift",
      description: `Edit shift ${shiftId} form opened.`,
    });
  };

  const handleReallocateShift = (from: string, to: string) => {
    toast({
      title: "Reallocate Seats",
      description: `Seats reallocated from ${from} to ${to}.`,
    });
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Shift Management</CardTitle>
            <CardDescription>Configure library operating shifts</CardDescription>
          </div>
          <Button onClick={handleAddNewShift}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Shift
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      {shift.currentOccupancy}
                      {shift.currentOccupancy.includes('(80%)') || 
                       shift.currentOccupancy.includes('(82%)') || 
                       shift.currentOccupancy.includes('(87%)') ? (
                        <span className="ml-2 flex items-center">
                          <AlertCircle className="h-4 w-4 text-amber-500" aria-label="High occupancy" />
                          <span className="sr-only">High occupancy</span>
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={shift.status === "active" ? "default" : "outline"}
                      className={shift.status === "active" ? "bg-green-500" : ""}
                    >
                      {shift.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditShift(shift.id)}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-md">
          <h4 className="font-medium mb-2">Auto Seat Reallocation</h4>
          <div className="flex flex-wrap gap-2 items-start">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleReallocateShift("Morning", "Evening")}
              className="flex items-center"
            >
              <RotateCw className="mr-1 h-3 w-3" />
              Morning → Evening
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleReallocateShift("Evening", "Late Evening")}
              className="flex items-center"
            >
              <RotateCw className="mr-1 h-3 w-3" />
              Evening → Late Evening
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => toast({
                title: "Configure Auto-Reallocation",
                description: "Auto-reallocation settings opened."
              })}
            >
              Configure Auto-Reallocation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftSchedule;
