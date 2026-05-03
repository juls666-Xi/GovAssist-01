"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md gov-card text-center">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gov-900 mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your account has been created. Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <Card className="w-full max-w-lg gov-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gov-700">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-gov-900">Create Account</CardTitle>
          <CardDescription>
            Register to access government assistance programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Dela Cruz"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                placeholder="juan123"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                className="mr-2"
                onChange={() => setShowPassword(!showPassword)}
              />
              <Label htmlFor="showPassword" className="text-sm font-normal cursor-pointer">
                Show password
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+63-9XX-XXX-XXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Street address"
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
                  placeholder="Barangay name"
                  value={formData.barangay}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
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
                  placeholder="Province"
                  value={formData.province}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="1000"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1" required />
              <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-gov-600 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-gov-600 hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gov-700 hover:bg-gov-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-gov-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
