// src/app/dashboard/layout.tsx
"use client"; // This component needs to be a client component to use useSession

import { type ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession
import { useRouter } from "next/navigation";
import Sidebar from "~/components/dashboard/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to the home page
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show a loading state while the session is being fetched
  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </main>
    );
  }

  // If unauthenticated, return null as the useEffect will handle the redirect
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Pass the session to the Sidebar */}
      <Sidebar session={session} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
