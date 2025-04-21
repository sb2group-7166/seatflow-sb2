import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InteractiveSeatMap from "@/components/dashboard/InteractiveSeatMap";
import LayoutConfigurator from "@/components/dashboard/LayoutConfigurator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sofa, Calendar, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface LayoutConfig {
  rows: number;
  columns: number;
  gap: number;
  showNumbers: boolean;
  showStatus: boolean;
  layout: boolean[][];
}

const SeatsPage = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    rows: 14,
    columns: 7,
    gap: 2,
    showNumbers: true,
    showStatus: true,
    layout: Array(14).fill(null).map(() => Array(7).fill(true))
  });

  const handleLayoutSave = (config: LayoutConfig) => {
    setLayoutConfig(config);
    setActiveTab("view");
  };

  const handleCardClick = (type: string) => {
    switch (type) {
      case 'total':
        setActiveTab("view");
        // You can add additional logic here
        break;
      case 'available':
        setActiveTab("view");
        // Filter to show only available seats
        break;
      case 'occupied':
        setActiveTab("view");
        // Filter to show only occupied seats
        break;
      case 'prebooked':
        setActiveTab("view");
        // Filter to show only pre-booked seats
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seat Management</h1>
          <p className="text-muted-foreground">
            Monitor library seating arrangements
          </p>
        </div>

        {/* Modern Seat Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => handleCardClick('total')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-900">Total Seats</CardTitle>
                <Sofa className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">98</div>
              <p className="text-xs text-blue-700 mt-2">Library capacity</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => handleCardClick('available')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-900">Available Seats</CardTitle>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">45</div>
              <p className="text-xs text-green-700 mt-2">Ready for use</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => handleCardClick('occupied')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-red-900">Occupied Seats</CardTitle>
                <Users className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">53</div>
              <p className="text-xs text-red-700 mt-2">Currently in use</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => handleCardClick('prebooked')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-900">Pre-booked</CardTitle>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">0</div>
              <p className="text-xs text-purple-700 mt-2">Reserved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for View and Configuration */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="view">View Layout</TabsTrigger>
            <TabsTrigger value="configure">Configure Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle>Seat Map</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveSeatMap />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configure">
            <LayoutConfigurator 
              onSave={handleLayoutSave}
              initialConfig={layoutConfig}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SeatsPage;
