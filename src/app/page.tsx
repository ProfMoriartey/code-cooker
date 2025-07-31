// src/app/page.tsx
import ProfileDropdown from "~/components/profile-dropdown"; // Import the client component
import Image from "next/image"; // Import Next.js Image component for optimized images

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-900">
      {/* Header for logo and auth buttons */}
      <header className="flex w-full items-center justify-between bg-white p-4 shadow-sm">
        {/* Logo (image now) */}
        <div className="flex items-center">
          <Image
            src="/flame.png" // Path to your logo image in the public directory
            alt="Code Cooker Logo"
            width={50} // Adjust width as needed
            height={40} // Adjust height as needed, Next.js Image requires width/height
            className="h-auto w-auto object-contain" // Ensures image scales properly and maintains aspect ratio
          />
        </div>

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </header>

      {/* Hero Section Content */}
      <div className="container flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-5xl leading-tight font-extrabold tracking-tight sm:text-[5rem]">
          Make it. Scan it. <span className="text-[#34D399]">Share it.</span>
        </h1>
        {/* <p className="max-w-2xl text-lg text-gray-700">
          Unlock the power of QR codes with our **fast, reliable, and incredibly
          simple** service.
          <br className="hidden sm:block" />
          From creation to sharing, we make it **easy and secure** for you.
          <br className="hidden sm:block" />
          Get started in just three quick steps!
        </p> */}

        {/* --- */}
        {/* Three Step Cards */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1: Make an Account */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {/* Placeholder for Image */}
              <Image
                src="https://placehold.co/96x96/E0E7FF/4F46E5?text=Account" // Placeholder image
                alt="Make an Account"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              1. Create Your Account
            </h2>
            <p className="text-center text-gray-700">
              Sign up in seconds to access all our powerful QR code features.
            </p>
          </div>

          {/* Card 2: Enter Data */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
              {/* Placeholder for Image */}
              <Image
                src="https://placehold.co/96x96/D1FAE5/059669?text=Data" // Placeholder image
                alt="Enter Data"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              2. Customize Your QR
            </h2>
            <p className="text-center text-gray-700">
              Easily input your information to generate unique and branded QR
              codes.
            </p>
          </div>

          {/* Card 3: Share Your QR Code */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              {/* Placeholder for Image */}
              <Image
                src="https://placehold.co/96x96/EDE9FE/8B5CF6?text=Share" // Placeholder image
                alt="Share Your QR Code"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              3. Share & Track
            </h2>
            <p className="text-center text-gray-700">
              Effortlessly share your QR codes and track their performance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
