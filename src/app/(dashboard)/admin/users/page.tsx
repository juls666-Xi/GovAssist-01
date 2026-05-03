"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Eye, Edit, Ban, CheckCircle, Loader2, Users } from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  _count?: { applications: number };
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setIsLoading(false);
  }

  async function handleStatusChange(userId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast({ title: "Status Updated", description: `User status changed to ${newStatus}`, variant: "success" });
        fetchUsers();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  }

  const filteredUsers = activeTab === "all"
    ? users
    : users.filter((u) => u.role === activeTab.toUpperCase());

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700",
    STAFF: "bg-blue-100 text-blue-700",
    CITIZEN: "bg-green-100 text-green-700",
  };

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their roles</p>
          </div>
          <Button className="bg-gov-700 hover:bg-gov-800">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({users.length})</TabsTrigger>
            <TabsTrigger value="citizen">Citizens ({users.filter((u) => u.role === "CITIZEN").length})</TabsTrigger>
            <TabsTrigger value="staff">Staff ({users.filter((u) => u.role === "STAFF").length})</TabsTrigger>
            <TabsTrigger value="admin">Admins ({users.filter((u) => u.role === "ADMIN").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="gov-card">
              <CardContent className="pt-6">
                <DataTable
                  data={filteredUsers}
                  isLoading={isLoading}
                  columns={[
                    {
                      key: "name",
                      header: "User",
                      cell: (item) => (
                        <div>
                          <p className="text-sm font-medium">{item.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      ),
                    },
                    {
                      key: "username",
                      header: "Username",
                      cell: (item) => <span className="text-sm font-mono">{item.username || "N/A"}</span>,
                    },
                    {
                      key: "role",
                      header: "Role",
                      cell: (item) => (
                        <Badge className={roleColors[item.role] || "bg-gray-100"}>
                          {item.role}
                        </Badge>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (item) => (
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      ),
                    },
                    {
                      key: "joined",
                      header: "Joined",
                      cell: (item) => <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>,
                    },
                    {
                      key: "lastLogin",
                      header: "Last Login",
                      cell: (item) => <span className="text-sm text-muted-foreground">{formatDate(item.lastLoginAt)}</span>,
                    },
                    {
                      key: "actions",
                      header: "Actions",
                      cell: (item) => (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(item); setDialogOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {item.status === "ACTIVE" ? (
                            <Button variant="ghost" size="sm" onClick={() => handleStatusChange(item.id, "SUSPENDED")}>
                              <Ban className="h-4 w-4 text-red-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleStatusChange(item.id, "ACTIVE")}>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  searchKey="name"
                  pageSize={15}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gov-900">User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gov-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gov-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedUser.name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">{selectedUser.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Login</p>
                    <p className="font-medium">{formatDate(selectedUser.lastLoginAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
