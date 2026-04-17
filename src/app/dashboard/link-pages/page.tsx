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
import { ColorPickerInput } from "~/components/ui/color-picker-input";

interface LinkItem {
  label: string;
  url: string;
}

export default function LinkPagesBuilder() {
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([{ label: "", url: "" }]);
  
  const [backgroundColor, setBackgroundColor] = useState("#F9FAFB");
  const [buttonColor, setButtonColor] = useState("#FFFFFF");
  const [buttonHoverColor, setButtonHoverColor] = useState("#4F46E5");
  const [textColor, setTextColor] = useState("#111827");

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
      const colors = { backgroundColor, buttonColor, buttonHoverColor, textColor };
      const result = await createMultiPageSet(title, validLinks, colors);

      if (result.success) {
        setFeedbackMessage(`Success! Your page is created. Short code: ${result.shortCode}`);
        setIsError(false);
        setTitle("");
        setLinks([{ label: "", url: "" }]);
        setBackgroundColor("#F9FAFB");
        setButtonColor("#FFFFFF");
        setButtonHoverColor("#4F46E5");
        setTextColor("#111827");
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

            <div className="pt-6 border-t border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-1 block">Background Color</Label>
                  <ColorPickerInput color={backgroundColor} onChange={setBackgroundColor} name="backgroundColor" />
                </div>
                <div>
                  <Label className="mb-1 block">Text Color</Label>
                  <ColorPickerInput color={textColor} onChange={setTextColor} name="textColor" />
                </div>
                <div>
                  <Label className="mb-1 block">Button Color</Label>
                  <ColorPickerInput color={buttonColor} onChange={setButtonColor} name="buttonColor" />
                </div>
                <div>
                  <Label className="mb-1 block">Button Hover Color</Label>
                  <ColorPickerInput color={buttonHoverColor} onChange={setButtonHoverColor} name="buttonHoverColor" />
                </div>
              </div>
            </div>

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