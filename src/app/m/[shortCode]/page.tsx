// src/app/m/[shortCode]/page.tsx
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { multiPageSets, multiPageItems } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

interface PublicPageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function PublicMultiPage({ params }: PublicPageProps) {
  const resolvedParams = await params;

  const pageData = await db.query.multiPageSets.findFirst({
    where: eq(multiPageSets.shortCode, resolvedParams.shortCode),
    with: {
      items: {
        orderBy: [asc(multiPageItems.sortOrder)],
      },
    },
  });

  if (!pageData) {
    notFound();
  }

  const dynamicStyles = {
    "--page-bg": pageData.backgroundColor,
    "--page-text": pageData.textColor,
    "--btn-bg": pageData.buttonColor,
    "--btn-hover": pageData.buttonHoverColor,
  } as React.CSSProperties;

  return (
    <main
      style={dynamicStyles}
      className="flex min-h-screen flex-col items-center bg-[var(--page-bg)] py-16 px-4 sm:px-6 transition-colors duration-300"
    >
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--page-text)]">
            {pageData.title}
          </h1>
        </div>

        <div className="flex flex-col space-y-4 mt-8">
          {pageData.items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center rounded-xl bg-[var(--btn-bg)] p-4 text-center text-lg font-medium text-[var(--page-text)] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[var(--btn-hover)] hover:text-white hover:shadow-md border border-black/5"
            >
              <span className="absolute left-4 text-[var(--page-text)] opacity-50 transition-colors duration-300 group-hover:text-white group-hover:opacity-100">
                <LinkIcon size={20} />
              </span>
              {item.label}
            </Link>
          ))}
          
          {pageData.items.length === 0 && (
            <p className="text-center text-[var(--page-text)] opacity-70">
              No links added to this page yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}