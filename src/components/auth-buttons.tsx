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
          <p className="text-2xl text-white">
            Welcome, {session.user?.name ?? "User"}!
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" passHref>
              <Button className="rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20">
                Go to Dashboard
              </Button>
            </Link>
            <Button
              onClick={() => void signOut()}
              className="rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20"
            >
              Sign out
            </Button>
          </div>
        </>
      ) : (
        // New button for generic sign-in page
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => void signIn()} // No provider specified, leads to providers list
            className="rounded-lg bg-[hsl(280,100%,70%)] px-8 py-4 text-xl font-bold text-white hover:bg-[hsl(280,100%,60%)]"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
