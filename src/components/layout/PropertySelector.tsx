import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  LifeBuoy, 
  User, 
  LogOut, 
  MessageCircle, 
  Settings, 
  Key, 
  Shield, 
  Users, 
  Clock,
  Bell,
  Info,
  Check,
  Filter,
  AlertCircle,
  Calendar,
  BookOpen,
  X,
  CreditCard
} from "lucide-react";
import { properties } from "@/data/properties";
import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HelpChat from "@/components/help/HelpChat";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

interface Notification {
  id: string;
  type: 'shift' | 'student' | 'seat' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
  color: string;
}

interface PropertySelectorProps {
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

export const PropertySelector = ({ selectedProperty, onPropertyChange }: PropertySelectorProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'shift',
      title: 'Shift Change Alert',
      description: 'Morning shift is ending in 30 minutes',
      timestamp: '2 minutes ago',
      isRead: false,
      icon: <Clock className="h-4 w-4" />,
      color: 'blue'
    },
    {
      id: '2',
      type: 'student',
      title: 'New Student Registration',
      description: 'Student Alex Johnson requires verification',
      timestamp: '15 minutes ago',
      isRead: false,
      icon: <User className="h-4 w-4" />,
      color: 'green'
    },
    {
      id: '3',
      type: 'seat',
      title: 'Seat Allocation Issue',
      description: 'Double booking detected for Seat #12',
      timestamp: '45 minutes ago',
      isRead: false,
      icon: <Info className="h-4 w-4" />,
      color: 'yellow'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      description: 'New payment of $50 received from John Smith',
      timestamp: '1 hour ago',
      isRead: false,
      icon: <CreditCard className="h-4 w-4" />,
      color: 'purple'
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update Available',
      description: 'New version 2.1.0 is ready to install',
      timestamp: '2 hours ago',
      isRead: false,
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'red'
    }
  ]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.isRead
  );

  // Mock admin user data - In real app, this would come from your auth context/API
  const adminUser: AdminUser = {
    id: "1",
    name: "John Doe",
    email: "admin@seatflow.com",
    role: "Super Admin",
    avatar: "/avatars/01.png",
    lastLogin: new Date().toLocaleString(),
  };

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);
  const PropertyLogo = selectedPropertyData?.logo || Building2;

  // Handler functions
  const handleProfileClick = useCallback(() => {
    navigate("/admin/profile");
  }, [navigate]);

  const handleSecuritySettings = useCallback(() => {
    navigate("/admin/security");
  }, [navigate]);

  const handleAccessControl = useCallback(() => {
    navigate("/admin/access-control");
  }, [navigate]);

  const handleTeamManagement = useCallback(() => {
    navigate("/admin/team");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      // In real app, call your logout API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Left Section - Property Selector */}
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${selectedPropertyData?.logoColor} bg-opacity-10 shadow-sm`}>
          <PropertyLogo className="h-6 w-6" />
        </div>
        <div>
          <Select value={selectedProperty} onValueChange={onPropertyChange}>
            <SelectTrigger className="h-auto p-0 border-none bg-transparent text-2xl font-bold hover:bg-transparent focus:ring-0">
              <SelectValue>
                {selectedPropertyData?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  <div className="flex items-center gap-2">
                    <property.logo className={`h-4 w-4 ${property.logoColor}`} />
                    <span>{property.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">Dashboard Overview</p>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-6">
        {/* Help Chat */}
        <HelpChat />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative group p-2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:duration-200"></div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <Bell className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors relative z-10" />
                </div>
              </div>
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Notifications</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    You have {unreadCount} unread messages
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                      onClick={handleMarkAllAsRead}
                    >
                    Mark all as read
                    </Button>
                  )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {filteredNotifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                  <div className={`mt-1 p-1 rounded-full ${notification.color === 'blue' ? 'bg-blue-100' : notification.color === 'green' ? 'bg-green-100' : notification.color === 'yellow' ? 'bg-yellow-100' : notification.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'}`}>
                      {notification.icon}
                    </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                  </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                    <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {adminUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSecuritySettings}>
              <Key className="mr-2 h-4 w-4" />
                <span>Security</span>
              </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAccessControl}>
              <Shield className="mr-2 h-4 w-4" />
                <span>Access Control</span>
              </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTeamManagement}>
              <Users className="mr-2 h-4 w-4" />
                <span>Team Management</span>
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}; 