"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import {
  LogOut,
  Users,
  Home,
  LayoutDashboard,
  PhoneCall,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const isAdmin = (session?.user as any)?.admin ? true : false;
  const isActive = (path: string) => pathname === path;
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4 mr-2" />,
      show: session?.user,
    },
    {
      href: "/admin/monitoring",
      label: "Monitor Sessions",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      show: isAdmin,
    },
    {
      href: "/admin/callers",
      label: "Manage Callers",
      icon: <Users className="h-4 w-4 mr-2" />,
      show: isAdmin,
    },
    {
      href: "/caller",
      label: "Caller Dashboard",
      icon: <PhoneCall className="h-4 w-4 mr-2" />,
      show: session?.user,
    },
  ];

  // Get user initials for avatar
  const getInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-white py-4 px-4 border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <Link href={item.href} key={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center"
                  size="sm"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-sm p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold"></DialogTitle>
              <DialogDescription className="text-sm text-gray-500 text-start">
                {session?.user?.name}
              </DialogDescription>
            </DialogHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems
                .filter((item) => item.show)
                .map((item) => (
                  <Link
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="flex items-center w-full justify-start"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          {session?.user && (
            <div className="hidden md:block text-sm text-gray-500 mr-2">
              {session.user.name}
            </div>
          )}

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="md:hidden px-2 py-1.5 text-sm font-medium">
                  {session?.user?.name}
                </div>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
