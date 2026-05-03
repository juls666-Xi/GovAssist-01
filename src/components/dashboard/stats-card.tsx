"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("gov-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-gov-50 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gov-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gov-900">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  trend === "up" && "bg-green-100 text-green-700",
                  trend === "down" && "bg-red-100 text-red-700",
                  trend === "neutral" && "bg-gray-100 text-gray-700"
                )}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
