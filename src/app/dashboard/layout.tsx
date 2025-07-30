// src/app/dashboard/layout.tsx
// src/app/dashboard/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "~/components/dashboard/sidebar"; // Import the new Sidebar component

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Sidebar for navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
