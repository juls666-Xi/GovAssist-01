"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, CheckCircle, XCircle, FileText, User, Calendar, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Application {
  id: string;
  applicationNumber: string;
  status: string;
  formData: Record<string, unknown> | null;
  remarks: string | null;
  reviewNotes: string | null;
  createdAt: string;
  submittedAt: string | null;
  program: { name: string; category: string; color: string | null };
  user: { name: string | null; email: string | null; firstName: string | null; lastName: string | null; phone: string | null };
  documents: Array<{ id: string; name: string; status: string; fileUrl: string }>;
  schedule: { scheduledDate: string; scheduledTime: string | null; location: string | null } | null;
}

export default function ReviewPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch applications on mount
  useState(() => {
    fetchApplications();
  });

  async function fetchApplications() {
    const res = await fetch("/api/applications?status=PENDING,REVIEWING,DOCUMENTS_REQUIRED");
    const data = await res.json();
    setApplications(data);
  }

  async function handleAction(action: "approve" | "reject" | "reviewing") {
    if (!selectedApp) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNotes }),
      });

      if (res.ok) {
        toast({
          title: action === "approve" ? "Application Approved" : action === "reject" ? "Application Rejected" : "Under Review",
          description: `Application ${selectedApp.applicationNumber} has been updated.`,
          variant: "success",
        });
        setDialogOpen(false);
        setSelectedApp(null);
        setReviewNotes("");
        fetchApplications();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update application", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredApps = activeTab === "all" 
    ? applications 
    : applications.filter((a) => a.status === activeTab.toUpperCase());

  return (
    <DashboardLayout requiredRole="STAFF">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Review Applications</h1>
          <p className="text-muted-foreground">Review and process citizen applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({applications.filter((a) => a.status === "PENDING").length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({applications.filter((a) => a.status === "REVIEWING").length})</TabsTrigger>
            <TabsTrigger value="documents_required">Documents ({applications.filter((a) => a.status === "DOCUMENTS_REQUIRED").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="gov-card">
              <CardContent className="pt-6">
                <DataTable
                  data={filteredApps}
                  columns={[
                    {
                      key: "applicationNumber",
                      header: "Application #",
                      cell: (item) => <span className="font-mono text-sm font-medium">{item.applicationNumber}</span>,
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
                      cell: (item) => <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>,
                    },
                    {
                      key: "actions",
                      header: "Actions",
                      cell: (item) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedApp(item); setDialogOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ),
                    },
                  ]}
                  searchKey="applicationNumber"
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gov-900">
                Review Application {selectedApp?.applicationNumber}
              </DialogTitle>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Applicant</p>
                    <p className="text-sm font-medium">{selectedApp.user.name || `${selectedApp.user.firstName} ${selectedApp.user.lastName}`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedApp.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedApp.user.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Program</p>
                    <p className="text-sm font-medium">{selectedApp.program.name}</p>
                  </div>
                </div>

                {/* Application Data */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Application Details</h4>
                  <div className="p-4 border rounded-lg">
                    {selectedApp.formData ? (
                      <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(selectedApp.formData, null, 2)}</pre>
                    ) : (
                      <p className="text-sm text-muted-foreground">No additional form data</p>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Documents ({selectedApp.documents.length})</h4>
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gov-600" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={doc.status} />
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">View</Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                <div>
                  <Label htmlFor="reviewNotes">Review Notes / Remarks</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter your review notes..."
                    rows={3}
                  />
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAction("reviewing")}
                    disabled={isLoading}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Mark Reviewing
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("reject")}
                    disabled={isLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAction("approve")}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Approve
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
