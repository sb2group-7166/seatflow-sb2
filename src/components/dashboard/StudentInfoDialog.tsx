import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "@/types";
import { 
  Edit2, 
  User, 
  BookOpen, 
  Calendar, 
  Mail, 
  GraduationCap, 
  Phone, 
  Clock, 
  Building2,
  MapPin,
  Shield,
  X,
  Check,
  Upload,
  CreditCard,
  Image
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface StudentInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
  seatNumber: string;
}

const StudentInfoDialog = ({ isOpen, onClose, student, seatNumber }: StudentInfoDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStudent(student);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save student:', editedStudent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStudent(student);
  };

  const handleInputChange = (field: keyof Student, value: string) => {
    if (editedStudent) {
      setEditedStudent({
        ...editedStudent,
        [field]: value
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Seat {seatNumber}</DialogTitle>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-white hover:bg-white/10"
                        onClick={handleSave}
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-white hover:bg-white/10"
                        onClick={handleCancel}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={handleEdit}
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={student ? "default" : "secondary"}>
                  {student ? "Occupied" : "Available"}
                </Badge>
                {student?.status && (
                  <Badge variant="outline" className="bg-white/10">
                    {student.status}
                  </Badge>
                )}
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {student ? (
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  {/* Photo Upload Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                        {photoUrl ? (
                          <img 
                            src={photoUrl} 
                            alt="Student photo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-xs">Upload Photo</span>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />
                            <Upload className="h-6 w-6 text-white" />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editedStudent?.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-xl font-semibold"
                          />
                          <Input
                            value={editedStudent?.id || ''}
                            onChange={(e) => handleInputChange('id', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="h-5 w-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Email</p>
                        {isEditing ? (
                          <Input
                            value={editedStudent?.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{student.email || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Phone className="h-5 w-5 text-violet-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Phone</p>
                        {isEditing ? (
                          <Input
                            value={editedStudent?.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{student.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shift Details Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground">Shift Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-5 w-5 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Shift Type</p>
                          {isEditing ? (
                            <Select
                              value={editedStudent?.shiftTiming || ''}
                              onValueChange={(value) => handleInputChange('shiftTiming', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select shift" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="morning">Morning (07:00 AM - 02:00 PM)</SelectItem>
                                <SelectItem value="evening">Evening (02:00 PM - 10:00 PM)</SelectItem>
                                <SelectItem value="lateEvening">Late Evening (02:00 PM - 12:00 AM)</SelectItem>
                                <SelectItem value="fullDay1">Full Day (07:00 AM - 12:00 AM)</SelectItem>
                                <SelectItem value="fullDay2">Full Day (07:00 AM - 10:00 PM)</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {student.shiftTiming ? 
                                student.shiftTiming === 'morning' ? 'Morning (07:00 AM - 02:00 PM)' :
                                student.shiftTiming === 'evening' ? 'Evening (02:00 PM - 10:00 PM)' :
                                student.shiftTiming === 'lateEvening' ? 'Late Evening (02:00 PM - 12:00 AM)' :
                                student.shiftTiming === 'fullDay1' ? 'Full Day (07:00 AM - 12:00 AM)' :
                                student.shiftTiming === 'fullDay2' ? 'Full Day (07:00 AM - 10:00 PM)' :
                                'Not specified'
                              : 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Study Zone</p>
                          {isEditing ? (
                            <Select
                              value={editedStudent?.studyCenter || ''}
                              onValueChange={(value) => handleInputChange('studyCenter', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select zone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-day">Full Day Zone</SelectItem>
                                <SelectItem value="half-day">Half Day Zone</SelectItem>
                                <SelectItem value="reading-area">Reading Area</SelectItem>
                                <SelectItem value="computer-zone">Computer Zone</SelectItem>
                                <SelectItem value="quiet-study">Quiet Study</SelectItem>
                                <SelectItem value="group-study">Group Study</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {student.studyCenter ? 
                                student.studyCenter === 'full-day' ? 'Full Day Zone' :
                                student.studyCenter === 'half-day' ? 'Half Day Zone' :
                                student.studyCenter === 'reading-area' ? 'Reading Area' :
                                student.studyCenter === 'computer-zone' ? 'Computer Zone' :
                                student.studyCenter === 'quiet-study' ? 'Quiet Study' :
                                student.studyCenter === 'group-study' ? 'Group Study' :
                                'Not specified'
                              : 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Study Center</p>
                          {isEditing ? (
                            <Select
                              value={editedStudent?.studyCenter || ''}
                              onValueChange={(value) => handleInputChange('studyCenter', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select center" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="main">Main Center</SelectItem>
                                <SelectItem value="north">North Center</SelectItem>
                                <SelectItem value="south">South Center</SelectItem>
                                <SelectItem value="east">East Center</SelectItem>
                                <SelectItem value="west">West Center</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground">{student.studyCenter || 'Not specified'}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Fee Payment Due Date</p>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editedStudent?.feePaymentDueDate || ''}
                              onChange={(e) => handleInputChange('feePaymentDueDate', e.target.value)}
                              className="text-sm"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {student.feePaymentDueDate ? new Date(student.feePaymentDueDate).toLocaleDateString() : 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Father and Husband's Name</p>
                        {isEditing ? (
                          <Input
                            value={editedStudent?.fatherName || ''}
                            onChange={(e) => handleInputChange('fatherName', e.target.value)}
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{student.fatherName}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-violet-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admission Date</p>
                        {isEditing ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {editedStudent?.admissionDate ? format(new Date(editedStudent.admissionDate), "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={editedStudent?.admissionDate ? new Date(editedStudent.admissionDate) : undefined}
                                onSelect={(date) => handleInputChange('admissionDate', date?.toISOString() || '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {student.admissionDate ? format(new Date(student.admissionDate), "PPP") : 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">ID Proof</p>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editedStudent?.idProof || ''}
                              onChange={(e) => handleInputChange('idProof', e.target.value)}
                              className="text-sm"
                              placeholder="ID Proof Number"
                            />
                            <div className="relative group">
                              <div className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                {editedStudent?.idProofPhoto ? (
                                  <img 
                                    src={editedStudent.idProofPhoto} 
                                    alt="ID Proof" 
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-400">
                                    <Image className="h-8 w-8 mb-2" />
                                    <span className="text-xs">Upload ID Photo</span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          handleInputChange('idProofPhoto', reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <Upload className="h-6 w-6 text-white" />
                                </label>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{student.idProof || 'Not provided'}</p>
                            {student.idProofPhoto && (
                              <div className="w-40 h-24 rounded-lg overflow-hidden">
                                <img 
                                  src={student.idProofPhoto} 
                                  alt="ID Proof" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Address</p>
                        {isEditing ? (
                          <Input
                            value={editedStudent?.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{student.address || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-violet-600" />
                      <div>
                        <p className="text-sm font-medium">Seat History</p>
                        <p className="text-sm text-muted-foreground">3 seats in the last month</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
                <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
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