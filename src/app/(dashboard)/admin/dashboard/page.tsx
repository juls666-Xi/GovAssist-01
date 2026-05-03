import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ProgramDistribution } from "@/components/dashboard/program-distribution";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

async function getAdminDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalUsers,
    totalApplications,
    pendingApplications,
    approvedThisMonth,
    totalPrograms,
    totalDocuments,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.application.count({
      where: { status: { in: ["PENDING", "REVIEWING", "DOCUMENTS_REQUIRED"] } },
    }),
    prisma.application.count({
      where: { status: "APPROVED", approvedAt: { gte: startOfMonth } },
    }),
    prisma.assistanceProgram.count(),
    prisma.document.count(),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  // Monthly data for charts
  const monthlyData = await Promise.all(
    Array.from({ length: 6 }).map((_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      return prisma.application.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: month, lt: nextMonth },
        },
        _count: { status: true },
      }).then((counts) => ({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        applications: counts.reduce((sum, c) => sum + c._count.status, 0),
        approved: counts.find((c) => c.status === "APPROVED")?._count.status || 0,
        rejected: counts.find((c) => c.status === "REJECTED")?._count.status || 0,
      }));
    })
  );

  // Program distribution
  const programStats = await prisma.assistanceProgram.findMany({
    include: {
      _count: { select: { applications: true } },
    },
  });

  const programDistribution = programStats
    .filter((p) => p._count.applications > 0)
    .map((p) => ({
      name: p.name,
      value: p._count.applications,
      color: p.color || "#0ea5e9",
    }));

  return {
    stats: { totalUsers, totalApplications, pendingApplications, approvedThisMonth, totalPrograms, totalDocuments },
    monthlyData: monthlyData.reverse(),
    programDistribution,
    recentActivity,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { stats, monthlyData, programDistribution, recentActivity } = await getAdminDashboardData();

  const activityItems = recentActivity.map((log) => ({
    id: log.id,
    type: log.action === "APPROVE" ? "approval" : log.action === "REJECT" ? "rejection" : log.action === "CREATE" ? "user" : "application",
    title: log.action.replace(/_/g, " "),
    description: log.details || `${log.action} on ${log.entity}`,
    user: log.user?.name || "System",
    timestamp: log.createdAt,
  }));

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="up"
            trendValue="+12%"
          />
          <StatsCard
            title="Applications"
            value={stats.totalApplications}
            icon={FileText}
            trend="up"
            trendValue="+8%"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingApplications}
            icon={Clock}
            description="Awaiting review"
          />
          <StatsCard
            title="Approved (Month)"
            value={stats.approvedThisMonth}
            icon={CheckCircle}
            trend="up"
            trendValue="+15%"
          />
          <StatsCard
            title="Programs"
            value={stats.totalPrograms}
            icon={BarChart3}
            description="Active programs"
          />
          <StatsCard
            title="Documents"
            value={stats.totalDocuments}
            icon={TrendingUp}
            description="Total uploaded"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ActivityChart data={monthlyData} type="bar" />
          <ProgramDistribution data={programDistribution} />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 gov-card">
            <CardHeader>
              <CardTitle className="text-lg text-gov-900">System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Logins Today", value: "45" },
                  { label: "New Users", value: "8" },
                  { label: "Files Uploaded", value: "23" },
                  { label: "Avg Process Time", value: "2.3 days" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-gov-900">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <RecentActivity activities={activityItems} />
        </div>
      </div>
    </DashboardLayout>
  );
}
