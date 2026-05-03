"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  applicationId: string;
  userId: string;
  programId: string;
  scheduledDate: string;
  scheduledTime: string | null;
  location: string | null;
  status: string;
  notes: string | null;
  application: {
    applicationNumber: string;
    user: { name: string | null; firstName: string | null; lastName: string | null };
    program: { name: string };
  };
}

export default function SchedulePage() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: "",
    time: "09:00",
    location: "",
    notes: "",
  });

  async function handleCreateSchedule() {
    if (!selectedDate) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scheduledDate: selectedDate.toISOString(),
        }),
      });

      if (res.ok) {
        toast({ title: "Schedule Created", description: "Claim schedule has been assigned.", variant: "success" });
        setDialogOpen(false);
        // Refresh schedules
      } else {
        throw new Error("Failed to create schedule");
      }
    } catch {
      toast({ title: "Error", description: "Failed to create schedule", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout requiredRole="STAFF">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gov-900">Schedule Claims</h1>
            <p className="text-muted-foreground">Manage claim schedules for approved applications</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-gov-700 hover:bg-gov-800">
            <Plus className="mr-2 h-4 w-4" />
            New Schedule
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-lg text-gov-900">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 gov-card">
            <CardHeader>
              <CardTitle className="text-lg text-gov-900">
                Schedules for {selectedDate ? formatDate(selectedDate) : "Today"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={schedules}
                columns={[
                  {
                    key: "application",
                    header: "Application",
                    cell: (item) => (
                      <div>
                        <p className="text-sm font-medium">{item.application.applicationNumber}</p>
                        <p className="text-xs text-muted-foreground">{item.application.user.name}</p>
                      </div>
                    ),
                  },
                  {
                    key: "program",
                    header: "Program",
                    cell: (item) => <span className="text-sm">{item.application.program.name}</span>,
                  },
                  {
                    key: "time",
                    header: "Time",
                    cell: (item) => (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.scheduledTime || "TBD"}</span>
                      </div>
                    ),
                  },
                  {
                    key: "location",
                    header: "Location",
                    cell: (item) => (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.location || "TBD"}</span>
                      </div>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (item) => <span className="text-sm">{item.status}</span>,
                  },
                ]}
                emptyMessage="No schedules for this date"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </div>

        {/* New Schedule Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gov-900">Create Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDate ? formatDate(selectedDate) : "Select a date"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., City Hall Room 205" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional instructions..." value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSchedule} disabled={isLoading} className="bg-gov-700 hover:bg-gov-800">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
