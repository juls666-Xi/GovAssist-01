"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Bell,
  User,
  Settings,
  Users,
  BarChart3,
  Shield,
  Calendar,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SidebarProps {
  role: "CITIZEN" | "STAFF" | "ADMIN";
}

const citizenLinks = [
  { href: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/citizen/programs", label: "Programs", icon: ClipboardList },
  { href: "/citizen/apply", label: "Apply Now", icon: FileText },
  { href: "/citizen/applications", label: "My Applications", icon: Search },
  { href: "/citizen/notifications", label: "Notifications", icon: Bell },
  { href: "/citizen/profile", label: "Profile", icon: User },
];

const staffLinks = [
  { href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/review", label: "Review Applications", icon: Search },
  { href: "/staff/schedule", label: "Schedule Claims", icon: Calendar },
  { href: "/staff/notifications", label: "Notifications", icon: Bell },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/programs", label: "Programs", icon: ClipboardList },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit Logs", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links = role === "ADMIN" ? adminLinks : role === "STAFF" ? staffLinks : citizenLinks;

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle Button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gov-50 text-gov-700 dark:bg-gov-900/20 dark:text-gov-300"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-gov-600")} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
