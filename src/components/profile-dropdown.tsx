"use client"; // This marks the component as a client component

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react"; // Import useSession, signIn, and signOut
import { useRouter } from "next/navigation"; // For navigation
import Image from "next/image"; // Import Next.js Image component

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Adjust path as per your project structure
import { Button } from "./ui/button"; // Adjust path as per your project structure
import { User, LayoutDashboard, LogOut, LogIn } from "lucide-react"; // For icons

export default function ProfileDropdown() {
  const { data: session, status } = useSession(); // Get session data and loading status
  const router = useRouter(); // Initialize router for navigation

  // Function to handle navigation to the dashboard
  const handleGoToDashboard = () => {
    console.log("Navigating to Dashboard...");
    router.push("/dashboard"); // Use Next.js router for navigation
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    console.log("Signing out...");
    // Await signOut to ensure the promise is handled.
    // The void operator is used here to explicitly indicate that the promise's return value is intentionally ignored.
    void (await signOut({ callbackUrl: "/" })); // Sign out and redirect to home page
  };

  // Function to handle user sign in
  const handleSignIn = () => {
    console.log("Signing in...");
    // The void operator is used here to explicitly indicate that the promise's return value is intentionally ignored.
    void signIn(); // Trigger NextAuth.js sign-in flow
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <Button
        variant="ghost"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 dark:text-gray-300"
        aria-label="Loading user data"
        disabled
      >
        <User className="h-6 w-6 animate-pulse" />{" "}
        {/* Add a loading animation */}
      </Button>
    );
  }

  // If no session, display a Sign In button
  if (!session) {
    return (
      <Button
        onClick={handleSignIn}
        variant="ghost"
        className="relative flex h-10 items-center justify-center rounded-full px-4 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Sign in"
      >
        <LogIn className="mr-2 h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  }

  // If session exists, display the dropdown menu
  return (
    <DropdownMenu>
      {/* DropdownMenuTrigger: This is the element that, when clicked, opens the dropdown. */}
      {/* We use 'asChild' to pass the Button component as the trigger. */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-12 w-16 items-center justify-center overflow-hidden rounded-full text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700" // Added overflow-hidden
          aria-label="User profile menu"
        >
          {/* Display user image if available, otherwise a generic User icon */}
          {session.user?.image ? (
            <div className="relative h-full w-full overflow-hidden rounded-full">
              {" "}
              {/* Added a div wrapper for better circular clipping */}
              <Image
                src={session.user.image}
                alt="User Avatar"
                fill // Fills the parent container
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                className="object-cover" // object-cover is on the image
              />
            </div>
          ) : (
            <User className="h-6 w-6" />
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* DropdownMenuContent: This is the actual content of the dropdown menu. */}
      <DropdownMenuContent
        className="w-56 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
        align="end"
      >
        {/* DropdownMenuLabel: Used for non-interactive labels, like the user's name and email. */}
        <DropdownMenuLabel className="px-2 py-1 font-semibold text-gray-900 dark:text-white">
          {session.user?.name ?? "User"} {/* Display user's name */}
          {session.user?.email && (
            <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
              {session.user.email} {/* Display user's email */}
            </p>
          )}
        </DropdownMenuLabel>

        {/* DropdownMenuSeparator: Adds a visual separator between groups of items. */}
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />

        {/* DropdownMenuGroup: Optional, for grouping related menu items. */}
        <DropdownMenuGroup>
          {/* DropdownMenuItem: An interactive item in the dropdown menu. */}
          <DropdownMenuItem
            onClick={handleGoToDashboard}
            className="flex cursor-pointer items-center space-x-2 rounded-md px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex cursor-pointer items-center space-x-2 rounded-md px-2 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
