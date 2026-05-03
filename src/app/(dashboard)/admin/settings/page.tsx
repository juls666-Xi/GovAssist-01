"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Mail, Upload, Globe, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    appName: "GovAssist Pro",
    contactEmail: "support@govassist.local",
    contactPhone: "+63-2-8123-4567",
    maxFileSize: "10",
    allowedFileTypes: "pdf,jpg,jpeg,png",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    requireEmailVerification: false,
  });

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast({ title: "Settings Saved", description: "System settings have been updated.", variant: "success" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">System Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Mail className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={settings.appName}
                    onChange={(e) => setSettings((s) => ({ ...s, appName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings((s) => ({ ...s, contactPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable the platform</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings((s) => ({ ...s, maintenanceMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => setSettings((s) => ({ ...s, registrationEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings((s) => ({ ...s, requireEmailVerification: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings((s) => ({ ...s, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings((s) => ({ ...s, smsNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Upload Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings((s) => ({ ...s, maxFileSize: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => setSettings((s) => ({ ...s, allowedFileTypes: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated list of file extensions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-gov-700 hover:bg-gov-800">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
