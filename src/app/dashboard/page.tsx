// src/app/dashboard/page.tsx
"use client";

// Removed useSession and useRouter as layout handles authentication state
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import QrCodeGeneratorForm from "~/components/dashboard/qr-code-generator-form";
import GeneratedQrCodeDisplay from "~/components/dashboard/generated-qr-code-display";
// Removed AuthStatusAndActions as it's now in the sidebar
// import AuthStatusAndActions from "~/components/dashboard/auth-status-and-actions";
import FeedbackDisplay from "~/components/shared/feedback-display";
import { useQrCodeGenerator } from "~/hooks/use-qr-code-generator";

export default function DashboardPage() {
  // Removed session and status destructuring
  // const { data: session, status } = useSession();
  // const router = useRouter();

  const {
    qrContent,
    setQrContent,
    qrType,
    setQrType,
    qrTitle,
    setQrTitle,
    generatedQrData,
    generatedQrType,
    feedbackMessage,

    isError,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    generateQrCode,
  } = useQrCodeGenerator();

  const handleGenerateSubmit = async (formData: FormData) => {
    await generateQrCode(formData);
  };

  // Removed useEffect for unauthenticated redirect as layout handles it
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/");
  //   }
  // }, [status, router]);

  // Removed loading and unauthenticated checks as layout handles them
  // if (status === "loading") {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
  //       <p className="text-xl text-gray-700">Loading session...</p>
  //     </div>
  //   );
  // }

  // if (status === "unauthenticated") {
  //   return null;
  // }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="rounded-lg p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            QR Code Generator
          </CardTitle>
          <CardDescription className="text-gray-600">
            Generate your QR codes here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {/* Removed AuthStatusAndActions */}
            {/* <AuthStatusAndActions session={session} /> */}

            <FeedbackDisplay message={feedbackMessage} isError={isError} />

            <QrCodeGeneratorForm
              qrContent={qrContent}
              setQrContent={setQrContent}
              qrTitle={qrTitle}
              setQrTitle={setQrTitle}
              qrType={qrType}
              setQrType={setQrType}
              handleSubmit={handleGenerateSubmit}
              foregroundColor={foregroundColor}
              setForegroundColor={setForegroundColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              feedbackMessage={null}
              isError={false}
            />

            {generatedQrData && (
              <GeneratedQrCodeDisplay
                generatedQrData={generatedQrData}
                generatedQrType={generatedQrType}
                foregroundColor={foregroundColor}
                backgroundColor={backgroundColor}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
