// src/components/dashboard/auth-status-and-actions.tsx
import Link from "next/link";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { Button } from "~/components/ui/button";

type AuthStatusAndActionsProps = {
  session: Session | null;
};

export default function AuthStatusAndActions({
  session,
}: AuthStatusAndActionsProps) {
  return (
    // Ensure content always stacks vertically within the sidebar
    <div className="flex w-full flex-col items-start gap-4 p-2">
      <p className="text-base font-medium break-words text-gray-800">
        Welcome, {session?.user?.name ?? "User"}!
      </p>
      {/* Button container: always stack vertically, take full width */}
      <div className="flex w-full flex-col gap-2">
        <Link href="/" passHref>
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
        <Button
          onClick={() => void signOut()}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
