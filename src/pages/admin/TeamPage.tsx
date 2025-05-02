import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Mail, Phone, Building, Shield, Search, Plus, MoreVertical, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export const TeamPage = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@seatflow.com",
      role: "Super Admin",
      status: "active",
      lastActive: "2 minutes ago",
      avatar: "/avatars/01.png",
      properties: ["SB2 Library", "SB1 Library"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@seatflow.com",
      role: "Property Manager",
      status: "active",
      lastActive: "5 minutes ago",
      avatar: "/avatars/02.png",
      properties: ["Main Library"],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@seatflow.com",
      role: "Staff",
      status: "inactive",
      lastActive: "2 hours ago",
      avatar: "/avatars/03.png",
      properties: ["SB2 Library"],
    },
  ]);

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
        {/* Team Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage your team members and their roles</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {teamMembers.length} Members
                </Badge>
                <Badge variant="outline" className="bg-white">
                  {teamMembers.filter(m => m.status === "active").length} Active
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members and their roles</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search team members..." className="pl-8" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.properties.map((property) => (
                          <Badge key={property} variant="secondary" className="bg-indigo-100 text-indigo-800">
                            {property}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "active" ? "success" : "secondary"}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.lastActive}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add New Member */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Team Member</CardTitle>
            <CardDescription>Invite a new member to your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Super Admin</SelectItem>
                    <SelectItem value="manager">Property Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Properties</Label>
              <div className="grid gap-4">
                {[
                  { id: "sb2", name: "SB2 Library" },
                  { id: "sb1", name: "SB1 Library" },
                  { id: "main", name: "Main Library" },
                ].map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">Assign access to this property</p>
                    </div>
                    <input type="checkbox" id={property.id} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Send Invitation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent activities by team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  user: "John Doe",
                  action: "Updated property settings",
                  timestamp: "2 minutes ago",
                  property: "SB2 Library",
                  status: "success",
                },
                {
                  id: 2,
                  user: "Jane Smith",
                  action: "Added new booking",
                  timestamp: "15 minutes ago",
                  property: "SB1 Library",
                  status: "success",
                },
                {
                  id: 3,
                  user: "Mike Johnson",
                  action: "Processed payment",
                  timestamp: "1 hour ago",
                  property: "Main Library",
                  status: "success",
                },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.property}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Success</Badge>
                    <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 