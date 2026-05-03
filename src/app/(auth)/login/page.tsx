"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/citizen/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md gov-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gov-700">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-gov-900">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your GovAssist Pro account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-gov-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gov-700 hover:bg-gov-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-gov-600 hover:underline font-medium">
              Create one
            </Link>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-center text-muted-foreground mb-2">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="text-center p-2 bg-muted rounded">
                <p className="font-medium">Admin</p>
                <p>admin@govassist.local</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="font-medium">Staff</p>
                <p>staff@govassist.local</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="font-medium">Citizen</p>
                <p>pedro@email.com</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-1">Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
