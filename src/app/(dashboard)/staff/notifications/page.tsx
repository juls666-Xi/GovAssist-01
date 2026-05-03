import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { Bell, Check, FileText, CheckCircle, XCircle, Calendar, AlertTriangle, UserCheck } from "lucide-react";

async function getStaffNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  APPLICATION_SUBMITTED: { icon: FileText, color: "bg-blue-100 text-blue-700" },
  APPLICATION_REVIEWING: { icon: Bell, color: "bg-yellow-100 text-yellow-700" },
  APPLICATION_APPROVED: { icon: CheckCircle, color: "bg-green-100 text-green-700" },
  APPLICATION_REJECTED: { icon: XCircle, color: "bg-red-100 text-red-700" },
  DOCUMENT_REQUIRED: { icon: AlertTriangle, color: "bg-orange-100 text-orange-700" },
  DOCUMENT_VERIFIED: { icon: CheckCircle, color: "bg-green-100 text-green-700" },
  SCHEDULE_ASSIGNED: { icon: Calendar, color: "bg-purple-100 text-purple-700" },
  STAFF_ASSIGNMENT: { icon: UserCheck, color: "bg-indigo-100 text-indigo-700" },
};

export default async function StaffNotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await getStaffNotifications(session.user.id);

  return (
    <DashboardLayout requiredRole="STAFF">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Notifications</h1>
          <p className="text-muted-foreground">System notifications and updates</p>
        </div>

        <Card className="gov-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gov-900">All Notifications</CardTitle>
            {notifications.some((n) => !n.isRead) && (
              <form action="/api/notifications/mark-all-read" method="POST">
                <Button variant="outline" size="sm" type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Mark All Read
                </Button>
              </form>
            )}
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type] || { icon: Bell, color: "bg-gray-100" };
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.isRead ? "bg-background" : "bg-gov-50/50 border-gov-200"
                      }`}
                    >
                      <div className={`rounded-full p-2 shrink-0 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm ${notification.isRead ? "font-normal" : "font-semibold"}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDateTime(notification.createdAt)}
                          </span>
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
