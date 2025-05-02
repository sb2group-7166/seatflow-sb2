import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Student } from "@/types";
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin,
  GraduationCap,
  Shield
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import PreBookedSeatDialog from './PreBookedSeatDialog';

interface StudentInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
  seatNumber: string;
}

const StudentInfoDialog = ({ isOpen, onClose, student, seatNumber }: StudentInfoDialogProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBookSeat = () => {
    onClose(); // Close the dialog
    navigate(`/students/add?seat=${seatNumber}`); // Navigate to add student page with seat number
  };

  if (student?.status === 'pre-booked') {
    return <PreBookedSeatDialog isOpen={isOpen} onClose={onClose} student={student} seatNumber={seatNumber} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="relative">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Seat {seatNumber}</DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={student ? "default" : "secondary"}>
                  {student ? "Occupied" : "Available"}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {student ? (
              <div className="space-y-6">
                {/* Student Profile Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={photoUrl || undefined} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Father's Name</p>
                        <p className="text-sm text-muted-foreground">{student.fatherName || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a 
                          href={`tel:${student.phone}`}
                          className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
                        >
                          {student.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Academic Information */}
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Academic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Admission Date</p>
                        <p className="text-sm text-muted-foreground">{student.admissionDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Study Center</p>
                        <p className="text-sm text-muted-foreground">{student.studyCenter || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Additional Information */}
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{student.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">ID Proof</p>
                        <p className="text-sm text-muted-foreground">{student.idProof}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Seat Available</h3>
                <p className="text-muted-foreground mb-4">
                  This seat is currently unoccupied and available for booking.
                </p>
                <Button 
                  variant="default" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleBookSeat}
                >
                  Book This Seat
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentInfoDialog; 