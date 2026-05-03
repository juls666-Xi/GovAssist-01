import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Bell,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getDashboardData(userId: string) {
  const [applications, notifications, programs] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      include: {
        program: { select: { name: true, category: true, color: true } },
        schedule: { select: { scheduledDate: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.assistanceProgram.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING" || a.status === "REVIEWING").length,
    approved: applications.filter((a) => a.status === "APPROVED").length,
    scheduled: applications.filter((a) => a.status === "SCHEDULED").length,
  };

  return { applications, notifications, programs, stats };
}

export default async function CitizenDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { applications, notifications, programs, stats } = await getDashboardData(session.user.id);

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Link href="/citizen/apply">
            <Button className="bg-gov-700 hover:bg-gov-800">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={FileText}
            description="All time submissions"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            description="Awaiting decision"
            trend="neutral"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            description="Successfully approved"
            trend="up"
            trendValue="+2"
          />
          <StatsCard
            title="Scheduled"
            value={stats.scheduled}
            icon={AlertCircle}
            description="Ready for claim"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card className="lg:col-span-2 gov-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gov-900">
                Recent Applications
              </CardTitle>
              <Link href="/citizen/applications">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No applications yet</p>
                  <Link href="/citizen/apply">
                    <Button variant="outline" className="mt-4">Apply Now</Button>
                  </Link>
                </div>
              ) : (
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
                      key: "program",
                      header: "Program",
                      cell: (item) => (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: item.program.color || "#0ea5e9" }}
                          />
                          <span className="text-sm">{item.program.name}</span>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (item) => <StatusBadge status={item.status} />,
                    },
                    {
                      key: "date",
                      header: "Date",
                      cell: (item) => (
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </span>
                      ),
                    },
                  ]}
                  searchable={false}
                  pagination={false}
                />
              )}
            </CardContent>
          </Card>

          {/* Notifications & Programs */}
          <div className="space-y-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gov-900 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No new notifications
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="h-2 w-2 rounded-full bg-gov-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/citizen/notifications">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    View All Notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gov-900">
                  Available Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{program.name}</p>
                        <p className="text-xs text-muted-foreground">{program.category}</p>
                      </div>
                      <Link href={`/citizen/apply?program=${program.id}`}>
                        <Button size="sm" variant="outline">Apply</Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link href="/citizen/programs">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Browse All Programs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
