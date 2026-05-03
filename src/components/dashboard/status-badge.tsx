"use client";

import { Badge } from "@/components/ui/badge";
import { cn, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(getStatusColor(status), "font-medium", className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
