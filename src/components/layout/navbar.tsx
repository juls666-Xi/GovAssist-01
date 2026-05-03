"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  Shield,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isPublic = !session?.user;
  const userRole = session?.user?.role;

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const dashboardLink = userRole === "ADMIN" 
    ? "/admin/dashboard" 
    : userRole === "STAFF" 
    ? "/staff/dashboard" 
    : "/citizen/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov-700">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gov-900 dark:text-gov-100">
            GovAssist<span className="text-gov-600">Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isPublic ? (
            publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gov-700",
                  pathname === link.href ? "text-gov-700" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))
          ) : (
            <Link
              href={dashboardLink}
              className="text-sm font-medium text-gov-700 hover:text-gov-800"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isPublic ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gov-700 hover:bg-gov-800">Get Started</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href={`/${userRole?.toLowerCase()}/notifications`}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                    3
                  </Badge>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback className="bg-gov-100 text-gov-700">
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${userRole?.toLowerCase()}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink}>
                      <Shield className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {isPublic ? (
            publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))
          ) : (
            <Link
              href={dashboardLink}
              className="block text-sm font-medium py-2 text-gov-700"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {isPublic ? (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-gov-700 hover:bg-gov-800">Get Started</Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
