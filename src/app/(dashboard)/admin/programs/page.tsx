"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Eye, Trash2, Users, Wallet, Calendar, Loader2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Program {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  budget: string | null;
  maxApplicants: number | null;
  currentApplicants: number;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  requirements: Array<{ id: string; name: string; isRequired: boolean }>;
}

export default function ProgramsManagementPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    requirements: "",
    benefits: "",
    eligibility: "",
    budget: "",
    maxApplicants: "",
    startDate: "",
    endDate: "",
    color: "#0ea5e9",
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    const res = await fetch("/api/programs?admin=true");
    const data = await res.json();
    setPrograms(data);
    setIsLoading(false);
  }

  function handleEdit(program: Program) {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description || "",
      category: program.category,
      requirements: "",
      benefits: "",
      eligibility: "",
      budget: program.budget || "",
      maxApplicants: program.maxApplicants?.toString() || "",
      startDate: program.startDate ? new Date(program.startDate).toISOString().split("T")[0] : "",
      endDate: program.endDate ? new Date(program.endDate).toISOString().split("T")[0] : "",
      color: program.color || "#0ea5e9",
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    const url = editingProgram ? `/api/programs/${editingProgram.id}` : "/api/programs";
    const method = editingProgram ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: editingProgram ? "Program Updated" : "Program Created",
          description: `Program has been successfully ${editingProgram ? "updated" : "created"}.`,
          variant: "success",
        });
        setDialogOpen(false);
        setEditingProgram(null);
        fetchPrograms();
      }
    } catch {
      toast({ title: "Error", description: "Failed to save program", variant: "destructive" });
    }
  }

  async function handleDelete(programId: string) {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      const res = await fetch(`/api/programs/${programId}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Deleted", description: "Program has been deleted.", variant: "success" });
        fetchPrograms();
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete program", variant: "destructive" });
    }
  }

  const filteredPrograms = activeTab === "all"
    ? programs
    : programs.filter((p) => p.status === activeTab.toUpperCase());

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">Programs Management</h1>
            <p className="text-muted-foreground">Manage assistance programs and their settings</p>
          </div>
          <Button
            className="bg-gov-700 hover:bg-gov-800"
            onClick={() => {
              setEditingProgram(null);
              setFormData({
                name: "",
                description: "",
                category: "",
                requirements: "",
                benefits: "",
                eligibility: "",
                budget: "",
                maxApplicants: "",
                startDate: "",
                endDate: "",
                color: "#0ea5e9",
              });
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({programs.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({programs.filter((p) => p.status === "ACTIVE").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({programs.filter((p) => p.status === "INACTIVE").length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({programs.filter((p) => p.status === "DRAFT").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="gov-card">
              <CardContent className="pt-6">
                <DataTable
                  data={filteredPrograms}
                  isLoading={isLoading}
                  columns={[
                    {
                      key: "name",
                      header: "Program",
                      cell: (item) => (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color || "#0ea5e9" }}
                          />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (item) => (
                        <Badge
                          className={
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : item.status === "INACTIVE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {item.status}
                        </Badge>
                      ),
                    },
                    {
                      key: "budget",
                      header: "Budget",
                      cell: (item) => <span className="text-sm">{item.budget ? formatCurrency(Number(item.budget)) : "N/A"}</span>,
                    },
                    {
                      key: "applicants",
                      header: "Applicants",
                      cell: (item) => (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{item.currentApplicants} / {item.maxApplicants || "∞"}</span>
                        </div>
                      ),
                    },
                    {
                      key: "period",
                      header: "Period",
                      cell: (item) => (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(item.startDate)} - {formatDate(item.endDate)}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "actions",
                      header: "Actions",
                      cell: (item) => (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  searchKey="name"
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Program Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gov-900">
                {editingProgram ? "Edit Program" : "Create New Program"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" type="number" value={formData.budget} onChange={(e) => setFormData((p) => ({ ...p, budget: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxApplicants">Max Applicants</Label>
                  <Input id="maxApplicants" type="number" value={formData.maxApplicants} onChange={(e) => setFormData((p) => ({ ...p, maxApplicants: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="color" type="color" value={formData.color} onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))} className="w-16 h-10 p-1" />
                  <span className="text-sm text-muted-foreground">{formData.color}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} className="bg-gov-700 hover:bg-gov-800">
                {editingProgram ? "Update" : "Create"} Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
