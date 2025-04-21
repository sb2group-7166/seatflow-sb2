import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, Calendar, Clock, User, Building2, Bookmark, FileText, IndianRupee, Image, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

// Mock data for students and seats
const mockStudents = [
  { id: "ST001", name: "John Doe", status: "active" },
  { id: "ST002", name: "Jane Smith", status: "active" },
  { id: "ST003", name: "Mike Johnson", status: "active" },
  { id: "ST004", name: "Sarah Williams", status: "active" },
];

const mockSeats = [
  { id: "A101", status: "available", section: "A" },
  { id: "A102", status: "available", section: "A" },
  { id: "B201", status: "available", section: "B" },
  { id: "B202", status: "available", section: "B" },
  { id: "C301", status: "available", section: "C" },
  { id: "C302", status: "available", section: "C" },
];

const AddBookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fatherOrHusbandName: "",
    contactNo: "",
    email: "",
    gender: "",
    age: "",
    address: "",
    emergencyContact: "",
    property: "",
    seatNo: "",
    bookingType: "long", // long or short
    moveInDate: undefined as Date | undefined,
    moveOutDate: undefined as Date | undefined,
    shift: "",
    fee: "",
    collection: "",
    notes: "",
    whatsappReminder: false,
    profilePhoto: null as File | null,
    idPhotoFront: null as File | null,
    idPhotoBack: null as File | null,
  });

  const [availableSeats, setAvailableSeats] = useState(mockSeats);
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [previewUrls, setPreviewUrls] = useState({
    profilePhoto: "",
    idPhotoFront: "",
    idPhotoBack: "",
  });

  // Filter available seats based on selected section
  useEffect(() => {
    if (selectedSection) {
      setAvailableSeats(mockSeats.filter(seat => 
        seat.section === selectedSection && seat.status === "available"
      ));
    } else {
      setAvailableSeats(mockSeats.filter(seat => seat.status === "available"));
    }
  }, [selectedSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.fatherOrHusbandName || !formData.contactNo || !formData.property || !formData.seatNo || !formData.bookingType || !formData.moveInDate || !formData.moveOutDate || !formData.shift || !formData.fee) {
        throw new Error("Please fill in all required fields");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Booking Created",
        description: "The student booking has been created successfully.",
      });

      navigate('/students');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | undefined | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setFormData(prev => ({ ...prev, seatNo: "" })); // Reset seat selection when section changes
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [field]: url,
      }));
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="default"
              onClick={() => navigate('/students')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">New Booking</h1>
              <p className="text-muted-foreground">
                Create a new student seat booking
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Personal Information Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-bold text-primary">Personal Information</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Enter the student's personal details and identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter student's name"
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fatherOrHusbandName" className="text-sm font-medium">Father's/Husband's Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="fatherOrHusbandName"
                          value={formData.fatherOrHusbandName}
                          onChange={(e) => handleInputChange("fatherOrHusbandName", e.target.value)}
                          placeholder="Enter father's/husband's name"
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactNo" className="text-sm font-medium">Contact Number <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactNo"
                          value={formData.contactNo}
                          onChange={(e) => handleInputChange("contactNo", e.target.value)}
                          placeholder="Enter contact number"
                          required
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            id="whatsappReminder"
                            checked={formData.whatsappReminder}
                            onChange={(e) => handleInputChange("whatsappReminder", e.target.checked)}
                            className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary/20"
                          />
                          <Label htmlFor="whatsappReminder" className="text-xs text-muted-foreground">
                            Enable WhatsApp fee reminder
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">Gender <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-bold text-primary">Booking Details</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Select the property, seat, and booking duration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="property" className="text-sm font-medium">Property <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.property}
                        onValueChange={(value) => handleInputChange("property", value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property1">Property 1</SelectItem>
                          <SelectItem value="property2">Property 2</SelectItem>
                          <SelectItem value="property3">Property 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seatNo" className="text-sm font-medium">Seat Number</Label>
                      <Select
                        value={formData.seatNo}
                        onValueChange={(value) => handleInputChange("seatNo", value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select seat" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSeats.map((seat) => (
                            <SelectItem key={seat.id} value={seat.id}>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>{seat.id}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bookingType" className="text-sm font-medium">Booking Type <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.bookingType}
                        onValueChange={(value) => handleInputChange("bookingType", value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select booking type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long">Long Term</SelectItem>
                          <SelectItem value="short">Short Term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shift" className="text-sm font-medium">Shift <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.shift}
                        onValueChange={(value) => handleInputChange("shift", value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Move In Date <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal focus:ring-2 focus:ring-primary/20",
                              !formData.moveInDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.moveInDate ? (
                              format(formData.moveInDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.moveInDate}
                            onSelect={(date) => handleInputChange("moveInDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Move Out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal focus:ring-2 focus:ring-primary/20",
                              !formData.moveOutDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.moveOutDate ? (
                              format(formData.moveOutDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.moveOutDate}
                            onSelect={(date) => handleInputChange("moveOutDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-bold text-primary">Payment Details</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Enter the payment information and any additional notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee" className="text-sm font-medium">Fee (₹) <span className="text-red-500">*</span></Label>
                      <Input
                        id="fee"
                        type="number"
                        value={formData.fee}
                        onChange={(e) => handleInputChange("fee", e.target.value)}
                        placeholder="Enter fee amount"
                        required
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collection" className="text-sm font-medium">Collection (₹)</Label>
                      <Input
                        id="collection"
                        type="number"
                        value={formData.collection}
                        onChange={(e) => handleInputChange("collection", e.target.value)}
                        placeholder="Enter collection amount"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Add any additional notes or special requirements"
                        className="focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-end gap-4 pt-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/students')}
                className="hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Booking
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBookingPage; 