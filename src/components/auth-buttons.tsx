// src/components/auth-buttons.tsx
"use client"; // This directive makes it a Client Component

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button"; // Assuming Button is available

export default function AuthButtons() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center gap-2">
      {session ? (
        <>
          {/* Adjusted text color for better contrast on light background */}
          <p className="text-lg text-gray-800">
            Welcome, {session.user?.name ?? "User"}!
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" passHref>
              {/* Primary button style for "Go to Dashboard" */}
              <Button className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">
                Go to Dashboard
              </Button>
            </Link>
            {/* Secondary button style for "Sign out" */}
            <Button
              onClick={() => void signOut()}
              className="rounded-lg bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300"
            >
              Sign out
            </Button>
          </div>
        </>
      ) : (
        // Primary button style for "Sign In"
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => void signIn()} // No provider specified, leads to providers list
            className="rounded-lg bg-indigo-600 px-8 py-4 text-xl font-bold text-white hover:bg-indigo-700"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
