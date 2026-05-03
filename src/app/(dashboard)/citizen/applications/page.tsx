import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, Download, Eye } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";

async function getApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: {
      program: { select: { name: true, category: true, color: true } },
      schedule: { select: { scheduledDate: true, scheduledTime: true, location: true, status: true } },
      documents: { select: { id: true, status: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const applications = await getApplications(session.user.id);

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">My Applications</h1>
            <p className="text-muted-foreground">
              Track and manage your assistance applications
            </p>
          </div>
          <Link href="/citizen/apply">
            <Button className="bg-gov-700 hover:bg-gov-800">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gov-900">
              All Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={applications}
              columns={[
                {
                  key: "applicationNumber",
                  header: "Application #",
                  cell: (item) => (
                    <span className="font-mono text-sm font-medium">{item.applicationNumber}</span>
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
                      <div>
                        <p className="text-sm font-medium">{item.program.name}</p>
                        <p className="text-xs text-muted-foreground">{item.program.category}</p>
                      </div>
                    </div>
                  ),
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
                      {formatDate(item.submittedAt || item.createdAt)}
                    </span>
                  ),
                },
                {
                  key: "schedule",
                  header: "Schedule",
                  cell: (item) =>
                    item.schedule ? (
                      <div className="text-sm">
                        <p className="font-medium">{formatDate(item.schedule.scheduledDate)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.schedule.scheduledTime}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not scheduled</span>
                    ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <div className="flex items-center gap-2">
                      <Link href={`/citizen/applications/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {item.status === "APPROVED" && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ),
                },
              ]}
              searchKey="applicationNumber"
              pageSize={10}
              emptyMessage="No applications found. Start by applying for a program."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
