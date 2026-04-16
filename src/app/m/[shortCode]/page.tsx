// src/app/m/[shortCode]/page.tsx
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { multiPageSets, multiPageItems } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

interface PublicPageProps {
  params: {
    shortCode: string;
  };
}

export default async function PublicMultiPage({ params }: PublicPageProps) {
  // Fetch the page data and its related links directly from the database
  const pageData = await db.query.multiPageSets.findFirst({
    where: eq(multiPageSets.shortCode, params.shortCode),
    with: {
      items: {
        orderBy: [asc(multiPageItems.sortOrder)],
      },
    },
  });

  // Return a 404 error if the page does not exist
  if (!pageData) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 py-16 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8">
        
        {/* Page Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 shadow-sm">
            <span className="text-3xl font-bold text-indigo-600">
              {pageData.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{pageData.title}</h1>
        </div>

        {/* Links List */}
        <div className="flex flex-col space-y-4 mt-8">
          {pageData.items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center rounded-xl bg-white p-4 text-center text-lg font-medium text-gray-800 shadow-sm transition-all hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-md border border-gray-200"
            >
              <span className="absolute left-4 text-gray-400 group-hover:text-indigo-200">
                <LinkIcon size={20} />
              </span>
              {item.label}
            </Link>
          ))}
          
          {pageData.items.length === 0 && (
            <p className="text-center text-gray-500">No links added to this page yet.</p>
          )}
        </div>

        {/* Branding Footer */}
        <div className="pt-12 text-center">
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors">
            Powered by QRGen
          </Link>
        </div>

      </div>
    </main>
  );
}