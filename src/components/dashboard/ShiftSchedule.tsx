import React, { useState } from "react";
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
  RotateCw,
  Save,
  X,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShiftScheduleProps {
  className?: string;
}

interface Shift {
  id: string;
  name: string;
  timeRange: string;
  capacity: string;
  currentOccupancy: string;
  status: string;
  staffAssigned: number;
}

// Updated mock data for shifts to align with SeatMap
const initialShifts: Shift[] = [
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
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [editingShift, setEditingShift] = useState<string | null>(null);
  const [editedShift, setEditedShift] = useState<Shift | null>(null);

  const handleAddNewShift = () => {
    const newShift: Shift = {
      id: `shift-${shifts.length + 1}`,
      name: "New Shift",
      timeRange: "00:00 AM - 00:00 PM",
      capacity: "0 seats",
      currentOccupancy: "0 seats (0%)",
      status: "inactive",
      staffAssigned: 0,
    };
    setShifts([...shifts, newShift]);
    setEditingShift(newShift.id);
    setEditedShift(newShift);
  };

  const handleEditShift = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setEditingShift(shiftId);
      setEditedShift({ ...shift });
    }
  };

  const handleSaveShift = () => {
    if (editingShift && editedShift) {
      setShifts(shifts.map(shift => 
        shift.id === editingShift ? editedShift : shift
      ));
      setEditingShift(null);
      setEditedShift(null);
      toast({
        title: "Shift Updated",
        description: "The shift has been successfully updated.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingShift(null);
    setEditedShift(null);
  };

  const handleReallocateShift = (from: string, to: string) => {
    toast({
      title: "Reallocate Seats",
      description: `Seats reallocated from ${from} to ${to}.`,
    });
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
    toast({
      title: "Shift Deleted",
      description: "The shift has been successfully deleted.",
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
                    {editingShift === shift.id ? (
                      <Input
                        value={editedShift?.name}
                        onChange={(e) => setEditedShift(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="h-8"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        {shift.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingShift === shift.id ? (
                      <Input
                        value={editedShift?.timeRange}
                        onChange={(e) => setEditedShift(prev => prev ? { ...prev, timeRange: e.target.value } : null)}
                        className="h-8"
                      />
                    ) : (
                      shift.timeRange
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {editingShift === shift.id ? (
                      <Input
                        value={editedShift?.capacity}
                        onChange={(e) => setEditedShift(prev => prev ? { ...prev, capacity: e.target.value } : null)}
                        className="h-8"
                      />
                    ) : (
                      shift.capacity
                    )}
                  </TableCell>
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
                    {editingShift === shift.id ? (
                      <Select
                        value={editedShift?.status}
                        onValueChange={(value) => setEditedShift(prev => prev ? { ...prev, status: value } : null)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={shift.status === "active" ? "default" : "outline"}
                        className={shift.status === "active" ? "bg-green-500" : ""}
                      >
                        {shift.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingShift === shift.id ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleSaveShift}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditShift(shift.id)}
                        >
                          <PencilLine className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteShift(shift.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6">
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
