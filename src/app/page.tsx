// src/app/page.tsx
import AuthButtons from "~/components/auth-buttons"; // Import the new client component

export default async function HomePage() {
  // session fetching is now handled inside AuthButtons,
  // so no need for 'auth' import or 'await auth()' here.

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">QR</span> Genie
        </h1>
        <p className="max-w-xl text-center text-lg">
          Your personal QR Code generation and management tool. Sign in to
          create, save, and manage your QR codes.
        </p>

        {/* Render the Client Component for authentication buttons */}
        <AuthButtons />
      </div>
    </main>
  );
}
