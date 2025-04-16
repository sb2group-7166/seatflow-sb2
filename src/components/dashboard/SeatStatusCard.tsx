import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sofa, Users, Clock } from "lucide-react";

// Define the proper badge variant type to match the Badge component's variant prop
type BadgeVariant = "default" | "destructive" | "outline" | "secondary";

interface SeatStatusCardProps {
  title: string;
  count: number;
  total: number;
  type: 'available' | 'occupied' | 'reserved' | 'maintenance';
  className?: string;
}

const SeatStatusCard = ({
  title,
  count,
  total,
  type,
  className
}: SeatStatusCardProps) => {
  const getStatusConfig = () => {
    switch (type) {
      case 'available':
        return {
          icon: Sofa,
          iconClass: 'text-green-500',
          badgeVariant: 'default' as BadgeVariant,
          badgeClass: 'bg-green-500'
        };
      case 'occupied':
        return {
          icon: Users,
          iconClass: 'text-red-500',
          badgeVariant: 'destructive' as BadgeVariant,
          badgeClass: ''
        };
      case 'reserved':
        return {
          icon: Clock,
          iconClass: 'text-amber-500',
          badgeVariant: 'outline' as BadgeVariant,
          badgeClass: 'border-amber-500 text-amber-500'
        };
      case 'maintenance':
        return {
          icon: Sofa,
          iconClass: 'text-slate-500',
          badgeVariant: 'outline' as BadgeVariant,
          badgeClass: 'border-slate-500 text-slate-500'
        };
      default:
        return {
          icon: Sofa,
          iconClass: 'text-primary',
          badgeVariant: 'outline' as BadgeVariant,
          badgeClass: ''
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const percentage = ((count / total) * 100).toFixed(1);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Badge 
            variant={config.badgeVariant} 
            className={config.badgeClass}
          >
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {percentage}% of total capacity
            </p>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  type === 'available' && 'bg-green-500',
                  type === 'occupied' && 'bg-red-500',
                  type === 'reserved' && 'bg-amber-500',
                  type === 'maintenance' && 'bg-slate-500'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <Icon className={cn('h-8 w-8', config.iconClass)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatStatusCard;