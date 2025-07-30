// src/components/shared/feedback-display.tsx
type FeedbackDisplayProps = {
  message: string | null;
  isError: boolean;
};

export default function FeedbackDisplay({
  message,
  isError,
}: FeedbackDisplayProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-md p-3 text-sm ${
        isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {message}
    </div>
  );
}
