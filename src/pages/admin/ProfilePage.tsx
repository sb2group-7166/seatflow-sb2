import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Key, Shield, Bell, Camera, CheckCircle2, ArrowLeft, Phone, CreditCard, MapPin, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "admin@seatflow.com",
    role: "Super Admin",
    avatar: "/avatars/01.png",
    lastLogin: new Date().toLocaleString(),
    properties: ["SB2 Library", "SB1 Library", "Main Library"],
    contactNumber: "+1 (555) 123-4567",
    employeeId: "EMP-2023-001",
    department: "Administration",
    position: "System Administrator",
    joiningDate: "2023-01-15",
    address: "123 Admin Street, Tech City, TC 12345",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543"
    }
  });

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <Badge variant="outline" className="bg-white">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Verified
                  </Badge>
                </div>
                <CardDescription className="text-lg">{user.email}</CardDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {user.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last login: {user.lastLogin}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex gap-2">
                      <Input id="name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input id="email" type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <div className="flex gap-2">
                      <Input id="phone" type="tel" value={user.contactNumber} onChange={(e) => setUser({...user, contactNumber: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <div className="flex gap-2">
                      <Input id="employeeId" value={user.employeeId} onChange={(e) => setUser({...user, employeeId: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="flex gap-2">
                      <Input id="department" value={user.department} onChange={(e) => setUser({...user, department: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <Briefcase className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <div className="flex gap-2">
                      <Input id="position" value={user.position} onChange={(e) => setUser({...user, position: e.target.value})} />
                      <Button variant="outline" size="icon">
                        <Briefcase className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex gap-2">
                    <Input id="address" value={user.address} onChange={(e) => setUser({...user, address: e.target.value})} />
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Emergency Contact</Label>
                  <div className="grid gap-4 p-4 rounded-lg border">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Name</Label>
                        <Input 
                          id="emergencyName" 
                          value={user.emergencyContact.name} 
                          onChange={(e) => setUser({
                            ...user, 
                            emergencyContact: {...user.emergencyContact, name: e.target.value}
                          })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyRelationship">Relationship</Label>
                        <Input 
                          id="emergencyRelationship" 
                          value={user.emergencyContact.relationship} 
                          onChange={(e) => setUser({
                            ...user, 
                            emergencyContact: {...user.emergencyContact, relationship: e.target.value}
                          })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Phone Number</Label>
                        <Input 
                          id="emergencyPhone" 
                          type="tel" 
                          value={user.emergencyContact.phone} 
                          onChange={(e) => setUser({
                            ...user, 
                            emergencyContact: {...user.emergencyContact, phone: e.target.value}
                          })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Properties</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.properties.map((property) => (
                      <Badge key={property} variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {property}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="flex gap-2">
                      <Input id="current-password" type="password" />
                      <Button variant="outline" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="flex gap-2">
                      <Input id="new-password" type="password" />
                      <Button variant="outline" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="flex gap-2">
                      <Input id="confirm-password" type="password" />
                      <Button variant="outline" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage your notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about important updates
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about security-related events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 