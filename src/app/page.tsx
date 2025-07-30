// src/app/page.tsx
import AuthButtons from "~/components/auth-buttons"; // Import the client component

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-900">
      {/* Header for logo and auth buttons */}
      <header className="flex w-full items-center justify-between bg-white p-4 shadow-sm">
        {/* Logo (text for now) */}
        <div className="text-2xl font-bold text-indigo-600">QRGen</div>

        {/* Auth Buttons (moved to top-right) */}
        <AuthButtons />
      </header>

      {/* Hero Section Content */}
      <div className="container flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-5xl leading-tight font-extrabold tracking-tight sm:text-[5rem]">
          The Simplest Place to Generate{" "}
          <span className="text-indigo-600">Sustainable QR Codes</span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-700">
          Create, manage, and track your QR codes effortlessly. Our platform
          focuses on simplicity and efficiency, helping you generate reliable QR
          codes for all your needs.
        </p>
      </div>
    </main>
  );
}
