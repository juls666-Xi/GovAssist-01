"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/utils";
import {
  FileCheck,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

interface Activity {
  id: string;
  type: "application" | "approval" | "rejection" | "document" | "schedule" | "user";
  title: string;
  description: string;
  user?: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  application: FileCheck,
  approval: CheckCircle,
  rejection: XCircle,
  document: FileCheck,
  schedule: Calendar,
  user: UserCheck,
};

const activityColors = {
  application: "bg-blue-100 text-blue-600",
  approval: "bg-green-100 text-green-600",
  rejection: "bg-red-100 text-red-600",
  document: "bg-yellow-100 text-yellow-600",
  schedule: "bg-purple-100 text-purple-600",
  user: "bg-gray-100 text-gray-600",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="gov-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gov-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      {activity.user && (
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">
                            {activity.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
