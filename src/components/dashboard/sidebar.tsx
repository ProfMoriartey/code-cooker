// src/components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, QrCode, List, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthStatusAndActions from "~/components/dashboard/auth-status-and-actions"; // Import AuthStatusAndActions
import type { Session } from "next-auth"; // Import Session type
// Import Session type

interface SidebarProps {
  session: Session | null; // Accept session as a prop
}

export default function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Generate QR Code",
      href: "/dashboard",
      icon: QrCode,
      isActive: pathname === "/dashboard",
    },
    {
      name: "Saved QR Codes",
      href: "/dashboard/saved",
      icon: List,
      isActive: pathname === "/dashboard/saved",
    },
  ];

  return (
    <>
      {/* Mobile Header (Burger Menu) */}
      <div className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white p-4 shadow-md md:hidden">
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <Home className="h-6 w-6 text-indigo-600" /> Dashboard
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <nav className="absolute top-[72px] left-0 z-10 w-full rounded-b-lg bg-white p-4 shadow-lg md:hidden">
          <ul className="mb-4 space-y-2">
            {" "}
            {/* Added margin-bottom */}
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <div
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center rounded-md p-3 text-lg font-medium transition-colors duration-200 ${
                      item.isActive
                        ? "bg-indigo-100 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } `}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {/* Auth status for mobile */}
          <div className="mt-4 border-t pt-4">
            {" "}
            {/* Separator for auth actions */}
            <AuthStatusAndActions session={session} />
          </div>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col rounded-r-lg bg-white p-4 shadow-md md:flex">
        <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <Home className="h-6 w-6 text-indigo-600" /> Dashboard
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <div
                    className={`flex items-center rounded-md p-3 text-lg font-medium transition-colors duration-200 ${
                      item.isActive
                        ? "bg-indigo-100 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } `}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Auth status for desktop */}
        <div className="mt-auto border-t pt-4">
          {" "}
          {/* Pushes to bottom, adds top border */}
          <AuthStatusAndActions session={session} />
        </div>
      </aside>
    </>
  );
}
