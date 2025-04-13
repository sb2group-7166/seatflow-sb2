
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OccupancyChartProps {
  className?: string;
}

const OccupancyChart = ({ className }: OccupancyChartProps) => {
  // Mock data
  const data = [
    {
      name: "8 AM",
      "Reading Area": 30,
      "Computer Zone": 45,
      "Quiet Study": 20,
      "Group Study": 15,
    },
    {
      name: "10 AM",
      "Reading Area": 55,
      "Computer Zone": 75,
      "Quiet Study": 60,
      "Group Study": 45,
    },
    {
      name: "12 PM",
      "Reading Area": 80,
      "Computer Zone": 85,
      "Quiet Study": 75,
      "Group Study": 90,
    },
    {
      name: "2 PM",
      "Reading Area": 75,
      "Computer Zone": 80,
      "Quiet Study": 65,
      "Group Study": 85,
    },
    {
      name: "4 PM",
      "Reading Area": 60,
      "Computer Zone": 70,
      "Quiet Study": 55,
      "Group Study": 75,
    },
    {
      name: "6 PM",
      "Reading Area": 85,
      "Computer Zone": 75,
      "Quiet Study": 90,
      "Group Study": 70,
    },
    {
      name: "8 PM",
      "Reading Area": 65,
      "Computer Zone": 55,
      "Quiet Study": 80,
      "Group Study": 45,
    },
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
        <CardDescription>
          Today's occupancy percentage by zone and hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, ""]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey="Reading Area" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Computer Zone" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Quiet Study" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Group Study" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
