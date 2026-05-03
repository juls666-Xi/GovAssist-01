"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Bell, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "success",
        });
        await update();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <User className="h-4 w-4 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="text-2xl bg-gov-100 text-gov-700">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63-9XX-XXX-XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="barangay">Barangay</Label>
                      <Input
                        id="barangay"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-gov-700 hover:bg-gov-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button className="bg-gov-700 hover:bg-gov-800">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="text-gov-900">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Application Updates", desc: "Status changes on your applications", default: true },
                    { label: "Document Verification", desc: "When your documents are reviewed", default: true },
                    { label: "Schedule Reminders", desc: "Upcoming claim schedules", default: true },
                    { label: "System Announcements", desc: "Platform updates and maintenance", default: false },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={pref.default}
                        className="rounded border-gray-300 h-4 w-4"
                      />
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
