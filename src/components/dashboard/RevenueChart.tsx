
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  className?: string;
}

const RevenueChart = ({ className }: RevenueChartProps) => {
  // Mock data
  const data = [
    {
      name: "Sun",
      bookings: 1400,
      penalties: 200,
      memberships: 900,
    },
    {
      name: "Mon",
      bookings: 2000,
      penalties: 300,
      memberships: 950,
    },
    {
      name: "Tue",
      bookings: 2200,
      penalties: 400,
      memberships: 1100,
    },
    {
      name: "Wed",
      bookings: 2800,
      penalties: 350,
      memberships: 1200,
    },
    {
      name: "Thu",
      bookings: 3100,
      penalties: 450,
      memberships: 1300,
    },
    {
      name: "Fri",
      bookings: 3600,
      penalties: 500,
      memberships: 1500,
    },
    {
      name: "Sat",
      bookings: 2900,
      penalties: 350,
      memberships: 1400,
    },
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          Weekly revenue breakdown by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
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
              tickFormatter={(value) => `₹${value}`}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, ""]} 
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="penalties"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="memberships"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
