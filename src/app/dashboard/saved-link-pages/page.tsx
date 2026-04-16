// src/app/dashboard/saved-link-pages/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Copy, Trash2, ExternalLink, Edit } from "lucide-react";
import { getUserMultiPageSets, deleteMultiPageSet } from "~/app/actions/multi-pages";
import { type MultiPageSet } from "~/lib/types";
import Link from "next/link";
import FeedbackDisplay from "~/components/shared/feedback-display";

export default function SavedLinkPages() {
  const [pages, setPages] = useState<MultiPageSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    void fetchPages();
  }, []);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const data = await getUserMultiPageSets();
      setPages(data);
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    setFeedbackMessage(null);
    setIsError(false);

    const result = await deleteMultiPageSet(id);

    if (result.success) {
      setFeedbackMessage(result.message);
      setPages(pages.filter((page) => page.id !== id));
    } else {
      setFeedbackMessage(result.message);
      setIsError(true);
    }
  };

  const handleCopyLink = async (shortCode: string) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
    const fullUrl = `${cleanAppUrl}/m/${shortCode}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setFeedbackMessage("Link copied to clipboard!");
      setIsError(false);
    } catch (err) {
      setFeedbackMessage("Failed to copy link.");
      setIsError(true);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Link Pages</h1>
          <p className="text-gray-600 mt-2">Manage your custom Link-in-Bio pages here.</p>
        </div>
        <Link href="/dashboard/link-pages">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create New Page
          </Button>
        </Link>
      </div>

      <FeedbackDisplay message={feedbackMessage} isError={isError} />

      {isLoading ? (
        <p className="text-center text-gray-500 py-10">Loading your pages...</p>
      ) : pages.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 mb-4">You have not created any link pages yet.</p>
            <Link href="/dashboard/link-pages">
              <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                Build Your First Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="shadow-sm border-gray-200 flex flex-col">
              {/* Header with Title and Delete Button */}
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1.5 overflow-hidden pr-4">
                  <CardTitle className="text-xl truncate" title={page.title}>
                    {page.title}
                  </CardTitle>
                  <CardDescription>
                    Created: {new Date(page.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleDelete(page.id)}
                  title="Delete Page"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>

              {/* Content with the remaining bottom buttons */}
              <CardContent className="flex-1 flex flex-col justify-end pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2"
                    onClick={() => handleCopyLink(page.shortCode)}
                  >
                    <Copy className="mr-1.5 h-4 w-4" /> Copy
                  </Button>
                  <Link href={`/dashboard/saved-link-pages/${page.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full border-gray-300 px-2">
                      <Edit className="mr-1.5 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <Link
                    href={`/m/${page.shortCode}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full border-gray-300 px-2">
                      <ExternalLink className="mr-1.5 h-4 w-4" /> View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}