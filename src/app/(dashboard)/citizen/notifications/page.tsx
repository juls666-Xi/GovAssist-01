import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { Bell, Check, Trash2, FileText, CheckCircle, XCircle, Calendar, AlertTriangle } from "lucide-react";

async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  APPLICATION_SUBMITTED: { icon: FileText, color: "bg-blue-100 text-blue-700", label: "Submitted" },
  APPLICATION_REVIEWING: { icon: Bell, color: "bg-yellow-100 text-yellow-700", label: "Reviewing" },
  APPLICATION_APPROVED: { icon: CheckCircle, color: "bg-green-100 text-green-700", label: "Approved" },
  APPLICATION_REJECTED: { icon: XCircle, color: "bg-red-100 text-red-700", label: "Rejected" },
  DOCUMENT_REQUIRED: { icon: AlertTriangle, color: "bg-orange-100 text-orange-700", label: "Documents" },
  DOCUMENT_VERIFIED: { icon: CheckCircle, color: "bg-green-100 text-green-700", label: "Verified" },
  SCHEDULE_ASSIGNED: { icon: Calendar, color: "bg-purple-100 text-purple-700", label: "Scheduled" },
  CLAIM_REMINDER: { icon: Bell, color: "bg-indigo-100 text-indigo-700", label: "Reminder" },
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await getNotifications(session.user.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <form action="/api/notifications/mark-all-read" method="POST">
              <Button variant="outline" size="sm" type="submit">
                <Check className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            </form>
          )}
        </div>

        <Card className="gov-card">
          <CardContent className="pt-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type] || { icon: Bell, color: "bg-gray-100", label: "General" };
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        notification.isRead ? "bg-background" : "bg-gov-50/50 border-gov-200"
                      }`}
                    >
                      <div className={`rounded-full p-2 shrink-0 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm ${notification.isRead ? "font-normal" : "font-semibold"}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(notification.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <form action={`/api/notifications/${notification.id}/mark-read`} method="POST">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Check className="h-3 w-3 mr-1" /> Mark read
                                </Button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
