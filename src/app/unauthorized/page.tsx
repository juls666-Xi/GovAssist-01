import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md gov-card text-center">
        <CardContent className="pt-12 pb-12">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gov-900 mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
