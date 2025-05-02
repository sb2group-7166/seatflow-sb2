import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Users, Lock, Eye, EyeOff, Key, Plus, Search, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export const AccessControlPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "Full access to all features and settings",
      permissions: ["all"],
      users: 1,
      status: "active",
    },
    {
      id: 2,
      name: "Property Manager",
      description: "Manage properties and their settings",
      permissions: ["properties", "users", "reports"],
      users: 3,
      status: "active",
    },
    {
      id: 3,
      name: "Staff",
      description: "Basic access to manage day-to-day operations",
      permissions: ["bookings", "payments"],
      users: 5,
      status: "active",
    },
  ]);

  const [permissions, setPermissions] = useState([
    { id: "properties", name: "Manage Properties", description: "Create, edit, and delete properties" },
    { id: "users", name: "Manage Users", description: "Create, edit, and delete users" },
    { id: "bookings", name: "Manage Bookings", description: "Create, edit, and delete bookings" },
    { id: "payments", name: "Manage Payments", description: "Process and manage payments" },
    { id: "reports", name: "View Reports", description: "Access and generate reports" },
    { id: "settings", name: "Manage Settings", description: "Change system settings" },
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
        {/* Access Control Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Manage roles and permissions across your organization</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {roles.length} Roles
                </Badge>
                <Badge variant="outline" className="bg-white">
                  {permissions.length} Permissions
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Roles Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage user roles and their permissions</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search roles..." className="pl-8" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>
                      <Badge variant={role.status === "active" ? "success" : "secondary"}>
                        {role.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Configure permissions for each role</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Description</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id}>{role.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id}>
                        <Switch
                          checked={role.permissions.includes("all") || role.permissions.includes(permission.id)}
                          disabled={role.permissions.includes("all")}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Access Logs</CardTitle>
            <CardDescription>View recent access attempts and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  user: "John Doe",
                  action: "Updated role permissions",
                  timestamp: "2 minutes ago",
                  status: "success",
                },
                {
                  id: 2,
                  user: "Jane Smith",
                  action: "Attempted to access restricted area",
                  timestamp: "15 minutes ago",
                  status: "failed",
                },
                {
                  id: 3,
                  user: "Admin",
                  action: "Created new role",
                  timestamp: "1 hour ago",
                  status: "success",
                },
              ].map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      log.status === "success" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {log.status === "success" ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{log.user}</p>
                      <p className="text-sm text-muted-foreground">{log.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={log.status === "success" ? "success" : "destructive"}>
                      {log.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Role */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Role</CardTitle>
            <CardDescription>Create a new role with custom permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input placeholder="Enter role name" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Enter role description" />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="grid gap-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{permission.name}</p>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Create Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 