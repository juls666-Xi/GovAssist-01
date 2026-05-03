"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ title, description, children, className }: ChartContainerProps) {
  return (
    <Card className={cn("gov-card", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gov-900">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
