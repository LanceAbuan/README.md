import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lance Abuan — Developer & Creator",
    template: "%s | Lance Abuan",
  },
  description:
    "Developer portfolio of Lance Abuan. Full-stack web development, game development, and AI workflows.",
  keywords: [
    "developer",
    "portfolio",
    "web development",
    "game development",
    "TypeScript",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Lance Abuan" }],
  openGraph: {
    title: "Lance Abuan — Developer & Creator",
    description:
      "Developer portfolio of Lance Abuan. Full-stack web development, game development, and AI workflows.",
    type: "website",
    locale: "en_US",
    siteName: "Lance Abuan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lance Abuan — Developer & Creator",
    description:
      "Developer portfolio of Lance Abuan. Full-stack web development, game development, and AI workflows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
