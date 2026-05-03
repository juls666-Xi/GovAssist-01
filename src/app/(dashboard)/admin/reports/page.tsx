"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, BarChart3, Users, FileSpreadsheet, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState("applications");
  const [dateRange, setDateRange] = useState("month");

  const sampleMonthlyData = [
    { month: "Jan", applications: 45, approved: 32, rejected: 8 },
    { month: "Feb", applications: 52, approved: 38, rejected: 10 },
    { month: "Mar", applications: 48, approved: 35, rejected: 7 },
    { month: "Apr", applications: 61, approved: 42, rejected: 12 },
    { month: "May", applications: 55, approved: 40, rejected: 9 },
    { month: "Jun", applications: 67, approved: 48, rejected: 11 },
  ];

  async function handleExport(format: "pdf" | "csv") {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/reports/export?type=${reportType}&range=${dateRange}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${reportType}-${dateRange}.${format}`;
        a.click();
        toast({ title: "Export Complete", description: `Report exported as ${format.toUpperCase()}`, variant: "success" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to export report", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">Reports</h1>
            <p className="text-muted-foreground">Generate and export system reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="gov-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applications">Applications Report</SelectItem>
                    <SelectItem value="users">Users Report</SelectItem>
                    <SelectItem value="programs">Programs Report</SelectItem>
                    <SelectItem value="documents">Documents Report</SelectItem>
                    <SelectItem value="audit">Audit Log Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="gov-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gov-900">328</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="gov-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gov-900">76%</div>
                  <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                </CardContent>
              </Card>
              <Card className="gov-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Process Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gov-900">2.3 days</div>
                  <p className="text-xs text-green-600 mt-1">-0.5 days from last month</p>
                </CardContent>
              </Card>
            </div>

            <ActivityChart data={sampleMonthlyData} type="bar" />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Application Statistics</CardTitle>
                <CardDescription>Detailed breakdown of application data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Pending", value: 45, color: "text-yellow-600" },
                    { label: "Reviewing", value: 23, color: "text-blue-600" },
                    { label: "Approved", value: 198, color: "text-green-600" },
                    { label: "Rejected", value: 62, color: "text-red-600" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", value: 156, icon: Users },
                    { label: "Citizens", value: 142, icon: Users },
                    { label: "Staff", value: 10, icon: Users },
                    { label: "Admins", value: 4, icon: Users },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                      <stat.icon className="mx-auto h-6 w-6 text-gov-600 mb-2" />
                      <p className="text-2xl font-bold text-gov-900">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Medical Assistance", applications: 128, approved: 95, budget: "₱5,000,000" },
                    { name: "Educational Support", applications: 87, approved: 72, budget: "₱3,000,000" },
                    { name: "Senior Citizen", applications: 56, approved: 48, budget: "₱2,000,000" },
                    { name: "Livelihood Program", applications: 34, approved: 28, budget: "₱4,000,000" },
                    { name: "Disaster Relief", applications: 23, approved: 20, budget: "₱10,000,000" },
                  ].map((program, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className="text-sm text-muted-foreground">{program.applications} applications</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{program.approved} approved</p>
                        <p className="text-xs text-muted-foreground">{program.budget} budget</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
