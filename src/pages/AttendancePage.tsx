import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface AttendanceRecord {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
  activities: {
    type: 'check-in' | 'check-out';
    timestamp: string;
    location?: string;
  }[];
  notes?: string;
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedStudent]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance/student/${selectedStudent}`);
      if (!response.ok) throw new Error('Failed to fetch attendance records');
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch attendance records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attendance/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          date,
          status,
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to record attendance');

      toast({
        title: 'Success',
        description: 'Attendance recorded successfully',
      });

      fetchAttendanceRecords();
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record attendance',
        variant: 'destructive',
      });
    }
  };

  const handleRecordActivity = async (type: 'check-in' | 'check-out') => {
    try {
      const response = await fetch('/api/attendance/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          type,
          location: 'Main Entrance',
        }),
      });

      if (!response.ok) throw new Error('Failed to record activity');

      toast({
        title: 'Success',
        description: `${type === 'check-in' ? 'Check-in' : 'Check-out'} recorded successfully`,
      });

      fetchAttendanceRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record activity',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      <Tabs defaultValue="record" className="space-y-4">
        <TabsList>
          <TabsTrigger value="record">Record Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <Card className="p-6">
            <form onSubmit={handleRecordAttendance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Add student options here */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: 'present' | 'absent' | 'late') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="submit">Record Attendance</Button>
                <Button type="button" variant="outline" onClick={() => handleRecordActivity('check-in')}>
                  Check In
                </Button>
                <Button type="button" variant="outline" onClick={() => handleRecordActivity('check-out')}>
                  Check Out
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="capitalize">{record.status}</TableCell>
                    <TableCell>
                      {record.checkInTime
                        ? format(new Date(record.checkInTime), 'hh:mm a')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime
                        ? format(new Date(record.checkOutTime), 'hh:mm a')
                        : '-'}
                    </TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 