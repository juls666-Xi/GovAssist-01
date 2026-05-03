import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getStaffDashboardData() {
  const [applications, pendingCount, approvedToday, totalCitizens, recentActivity] = await Promise.all([
    prisma.application.findMany({
      where: { status: { in: ["PENDING", "REVIEWING", "DOCUMENTS_REQUIRED"] } },
      include: {
        program: { select: { name: true } },
        user: { select: { name: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.application.count({
      where: { status: { in: ["PENDING", "REVIEWING", "DOCUMENTS_REQUIRED"] } },
    }),
    prisma.application.count({
      where: {
        status: "APPROVED",
        approvedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.user.count({ where: { role: "CITIZEN" } }),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { applications, pendingCount, approvedToday, totalCitizens, recentActivity };
}

export default async function StaffDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { applications, pendingCount, approvedToday, totalCitizens, recentActivity } = await getStaffDashboardData();

  const activityItems = recentActivity.map((log) => ({
    id: log.id,
    type: log.action === "APPROVE" ? "approval" : log.action === "REJECT" ? "rejection" : "application",
    title: log.action.replace(/_/g, " "),
    description: log.details || `${log.action} on ${log.entity}`,
    user: log.user?.name || "System",
    timestamp: log.createdAt,
  }));

  return (
    <DashboardLayout requiredRole="STAFF">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Staff Dashboard</h1>
          <p className="text-muted-foreground">Review applications and manage citizen requests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Pending Review"
            value={pendingCount}
            icon={Clock}
            description="Applications awaiting review"
            trend="up"
            trendValue="+5"
          />
          <StatsCard
            title="Approved Today"
            value={approvedToday}
            icon={CheckCircle}
            description="Applications approved today"
            trend="up"
            trendValue="+2"
          />
          <StatsCard
            title="Total Citizens"
            value={totalCitizens}
            icon={Users}
            description="Registered citizen accounts"
          />
          <StatsCard
            title="Queue"
            value={applications.filter((a) => a.status === "PENDING").length}
            icon={AlertCircle}
            description="In initial review queue"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 gov-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gov-900">
                Applications to Review
              </CardTitle>
              <Link href="/staff/review">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DataTable
                data={applications}
                columns={[
                  {
                    key: "applicationNumber",
                    header: "Application #",
                    cell: (item) => (
                      <span className="font-mono text-sm">{item.applicationNumber}</span>
                    ),
                  },
                  {
                    key: "applicant",
                    header: "Applicant",
                    cell: (item) => (
                      <div>
                        <p className="text-sm font-medium">{item.user.name || `${item.user.firstName} ${item.user.lastName}`}</p>
                        <p className="text-xs text-muted-foreground">{item.user.email}</p>
                      </div>
                    ),
                  },
                  {
                    key: "program",
                    header: "Program",
                    cell: (item) => <span className="text-sm">{item.program.name}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (item) => <StatusBadge status={item.status} />,
                  },
                  {
                    key: "submitted",
                    header: "Submitted",
                    cell: (item) => (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    ),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    cell: (item) => (
                      <Link href={`/staff/review/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    ),
                  },
                ]}
                searchKey="applicationNumber"
                pageSize={8}
              />
            </CardContent>
          </Card>

          <RecentActivity activities={activityItems} />
        </div>
      </div>
    </DashboardLayout>
  );
}
