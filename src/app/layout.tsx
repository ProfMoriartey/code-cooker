// src/app/layout.tsx
import "~/styles/globals.css"; // Your global CSS
import { Inter } from "next/font/google"; // Or whatever font you use
import { SessionProvider } from "next-auth/react"; // <--- Crucial Import
import { auth } from "~/server/auth"; // <--- Or where your auth object is exported

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "QR Code Cooker",
  description: "Generate and save QR codes fast and simple",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Fetch session on the server

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        {/* Wrap your children with SessionProvider */}
        <SessionProvider session={session}>
          {" "}
          {/* <--- Key part */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
