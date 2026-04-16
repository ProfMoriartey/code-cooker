// src/app/dashboard/link-pages/page.tsx
"use client";

import { useState } from "react";
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
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { createMultiPageSet } from "~/app/actions/multi-pages";
import FeedbackDisplay from "~/components/shared/feedback-display";


interface LinkItem {
    label: string;
    url: string;
  }
  
  export default function LinkPagesBuilder() {
    const [title, setTitle] = useState("");
    
    // Force strict typing on the state
    const [links, setLinks] = useState<LinkItem[]>([{ label: "", url: "" }]); 
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
  
    const handleAddLink = () => {
      if (links.length < 10) {
        setLinks([...links, { label: "", url: "" }]);
      }
    };
  
    const handleRemoveLink = (indexToRemove: number) => {
      setLinks(links.filter((_, index) => index !== indexToRemove));
    };
  
    // Change "field" type to keyof LinkItem
    const handleLinkChange = (index: number, field: keyof LinkItem, value: string) => {
        const updatedLinks = [...links];
        
        // Add "as LinkItem" to assure TypeScript the structure is intact
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

    // Filter out completely empty links to prevent saving blank rows
    const validLinks = links.filter((link) => link.label.trim() !== "" || link.url.trim() !== "");

    setIsSubmitting(true);

    try {
      const result = await createMultiPageSet(title, validLinks);

      if (result.success) {
        setFeedbackMessage(`Success! Your page is created. Short code: ${result.shortCode}`);
        setIsError(false);
        // Reset form
        setTitle("");
        setLinks([{ label: "", url: "" }]);
      } else {
        setFeedbackMessage(result.message || "Failed to create page.");
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

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="rounded-lg p-6 shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Link Page Builder</CardTitle>
          <CardDescription className="text-gray-600">
            Create a custom landing page with multiple links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackDisplay message={feedbackMessage} isError={isError} />

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Page Title */}
            <div>
              <Label htmlFor="page-title" className="mb-1 block font-semibold text-gray-700">
                Page Title
              </Label>
              <Input
                id="page-title"
                placeholder="e.g., My Social Links"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Links Container */}
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
                      placeholder="Link Label (e.g., My Portfolio)"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    />
                    <Input
                      type="url"
                      placeholder="URL (e.g., https://example.com)"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 p-2"
                    >
                      <Trash2 size={20} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Link Button */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Link Page"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}