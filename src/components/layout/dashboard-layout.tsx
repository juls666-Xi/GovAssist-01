import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "CITIZEN" | "STAFF" | "ADMIN";
}

export async function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role as "CITIZEN" | "STAFF" | "ADMIN";

  if (requiredRole && userRole !== requiredRole && userRole !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role={userRole} />
      <main className="pt-16 transition-all duration-300 md:ml-64">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
