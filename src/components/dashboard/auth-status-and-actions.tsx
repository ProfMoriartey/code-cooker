// src/components/dashboard/auth-status-and-actions.tsx
import Link from "next/link";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth"; // Changed import for Session
import { Button } from "~/components/ui/button";

type AuthStatusAndActionsProps = {
  session: Session | null;
};

export default function AuthStatusAndActions({
  session,
}: AuthStatusAndActionsProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-lg text-gray-800">
        Welcome, {session?.user?.name ?? "User"}!
      </p>
      <div className="flex gap-2">
        <Link href="/" passHref>
          <Button variant="outline">Back to Home</Button>
        </Link>
        <Button
          onClick={() => void signOut()}
          className="bg-red-500 hover:bg-red-600"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
