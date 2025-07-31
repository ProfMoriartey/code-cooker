// src/app/dashboard/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import QrCodeGeneratorForm from "~/components/dashboard/qr-code-generator-form";
import GeneratedQrCodeDisplay from "~/components/dashboard/generated-qr-code-display";

import FeedbackDisplay from "~/components/shared/feedback-display";
import { useQrCodeGenerator } from "~/hooks/use-qr-code-generator";

export default function DashboardPage() {
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
