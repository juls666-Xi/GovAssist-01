import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { Shield, UserCheck, FileEdit, Trash2, CheckCircle, XCircle, Key, Settings } from "lucide-react";

async function getAuditLogs() {
  return prisma.auditLog.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LOGIN: UserCheck,
  LOGOUT: UserCheck,
  REGISTER: UserCheck,
  CREATE: FileEdit,
  UPDATE: FileEdit,
  DELETE: Trash2,
  APPROVE: CheckCircle,
  REJECT: XCircle,
  VERIFY: Shield,
  SCHEDULE: Settings,
  CLAIM: CheckCircle,
  EXPORT: FileEdit,
  SETTINGS_CHANGE: Settings,
  PASSWORD_CHANGE: Key,
  ROLE_CHANGE: UserCheck,
  STATUS_CHANGE: Settings,
};

const actionColors: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  REGISTER: "bg-green-100 text-green-700",
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  APPROVE: "bg-green-100 text-green-700",
  REJECT: "bg-red-100 text-red-700",
  VERIFY: "bg-purple-100 text-purple-700",
  SCHEDULE: "bg-indigo-100 text-indigo-700",
  CLAIM: "bg-green-100 text-green-700",
  EXPORT: "bg-blue-100 text-blue-700",
  SETTINGS_CHANGE: "bg-orange-100 text-orange-700",
  PASSWORD_CHANGE: "bg-gray-100 text-gray-700",
  ROLE_CHANGE: "bg-purple-100 text-purple-700",
  STATUS_CHANGE: "bg-yellow-100 text-yellow-700",
};

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const logs = await getAuditLogs();

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Audit Logs</h1>
          <p className="text-muted-foreground">Complete history of all system actions</p>
        </div>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="text-lg text-gov-900">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={logs}
              columns={[
                {
                  key: "action",
                  header: "Action",
                  cell: (item) => {
                    const Icon = actionIcons[item.action] || Shield;
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-1.5 ${actionColors[item.action] || "bg-gray-100"}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.action}
                        </Badge>
                      </div>
                    );
                  },
                },
                {
                  key: "entity",
                  header: "Entity",
                  cell: (item) => (
                    <div>
                      <p className="text-sm font-medium">{item.entity}</p>
                      <p className="text-xs text-muted-foreground">{item.entityId}</p>
                    </div>
                  ),
                },
                {
                  key: "user",
                  header: "User",
                  cell: (item) => (
                    <div>
                      <p className="text-sm">{item.user?.name || "System"}</p>
                      <p className="text-xs text-muted-foreground">{item.user?.email}</p>
                    </div>
                  ),
                },
                {
                  key: "details",
                  header: "Details",
                  cell: (item) => (
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {item.details || "-"}
                    </p>
                  ),
                },
                {
                  key: "ip",
                  header: "IP Address",
                  cell: (item) => <span className="text-sm font-mono text-muted-foreground">{item.ipAddress || "N/A"}</span>,
                },
                {
                  key: "timestamp",
                  header: "Timestamp",
                  cell: (item) => <span className="text-sm text-muted-foreground">{formatDateTime(item.createdAt)}</span>,
                },
              ]}
              searchKey="details"
              pageSize={20}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
