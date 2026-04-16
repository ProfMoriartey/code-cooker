// src/app/dashboard/saved-link-pages/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Plus, Trash2, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { getMultiPageSetById, updateMultiPageSet } from "~/app/actions/multi-pages";
import FeedbackDisplay from "~/components/shared/feedback-display";
import Link from "next/link";

interface LinkItem {
  label: string;
  url: string;
}

export default function EditLinkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const pageId = parseInt(params.id, 10);

  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([{ label: "", url: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (isNaN(pageId)) return;
      
      const data = await getMultiPageSetById(pageId);
      
      if (data) {
        setTitle(data.title);
        // Cast the returned items to match the LinkItem interface
        if (data.items && data.items.length > 0) {
          setLinks(data.items.map(item => ({ label: item.label, url: item.url })));
        } else {
          setLinks([]);
        }
      } else {
        setFeedbackMessage("Page not found.");
        setIsError(true);
      }
      setIsLoading(false);
    }
    
    void loadData();
  }, [pageId]);

  const handleAddLink = () => {
    if (links.length < 10) {
      setLinks([...links, { label: "", url: "" }]);
    }
  };

  const handleRemoveLink = (indexToRemove: number) => {
    setLinks(links.filter((_, index) => index !== indexToRemove));
  };

  const handleLinkChange = (index: number, field: keyof LinkItem, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value } as LinkItem;
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);
    setIsError(false);

    if (!title.trim()) {
      setFeedbackMessage("Page title is required.");
      setIsError(true);
      return;
    }

    const validLinks = links.filter((link) => link.label.trim() !== "" || link.url.trim() !== "");

    setIsSubmitting(true);

    try {
      const result = await updateMultiPageSet(pageId, title, validLinks);

      if (result.success) {
        setFeedbackMessage(result.message);
        setIsError(false);
        // Redirect back to the saved pages list after successful edit
        setTimeout(() => router.push("/dashboard/saved-link-pages"), 1500);
      } else {
        setFeedbackMessage(result.message || "Failed to update page.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFeedbackMessage("An unexpected error occurred.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">Loading page details...</p>;
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="mb-4">
        <Link href="/dashboard/saved-link-pages">
          <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Saved Pages
          </Button>
        </Link>
      </div>

      <Card className="rounded-lg p-6 shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Edit Link Page</CardTitle>
          <CardDescription className="text-gray-600">
            Update your title or change your links below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackDisplay message={feedbackMessage} isError={isError} />

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <Label htmlFor="page-title" className="mb-1 block font-semibold text-gray-700">
                Page Title
              </Label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-gray-700">Your Links</Label>
                <span className="text-sm text-gray-500">{links.length}/10 Links</span>
              </div>

              {links.map((link, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-md bg-gray-50 border-gray-200">
                  <div className="mt-2 text-gray-400">
                    <LinkIcon size={20} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Link Label"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    />
                    <Input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 p-2"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              ))}
            </div>

            {links.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLink}
                className="w-full py-4 border-dashed border-2 border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Another Link
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? "Saving Updates..." : "Update Link Page"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}