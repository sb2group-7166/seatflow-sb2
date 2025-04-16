import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InteractiveSeatMap from "@/components/dashboard/InteractiveSeatMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { getAllSeats } from "@/api/seats";

interface SeatStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
}

const SeatsPage = () => {
  const [seatStats, setSeatStats] = useState<SeatStats>({
    total: 98,
    available: 98,
    occupied: 0,
    reserved: 0,
    maintenance: 0
  });

  useEffect(() => {
    const fetchSeatsData = async () => {
      try {
        const seats = await getAllSeats();
        // Update seat statistics
        const stats: SeatStats = {
          total: seats.length,
          available: seats.filter(s => s.status === 'available').length,
          occupied: seats.filter(s => s.status === 'occupied').length,
          reserved: seats.filter(s => s.status === 'reserved').length,
          maintenance: seats.filter(s => s.status === 'maintenance').length
        };
        setSeatStats(stats);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeatsData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Seat Management</h1>
            <p className="text-muted-foreground">
              Monitor library seating arrangements
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Seat Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seatStats.total}</div>
              <p className="text-xs text-muted-foreground mt-2">Library capacity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{seatStats.available}</div>
              <p className="text-xs text-muted-foreground mt-2">Ready for use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Occupied Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{seatStats.occupied}</div>
              <p className="text-xs text-muted-foreground mt-2">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{seatStats.maintenance}</div>
              <p className="text-xs text-muted-foreground mt-2">Under maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Seat Map */}
        <Card>
          <CardHeader>
            <CardTitle>Seat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveSeatMap />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SeatsPage;
