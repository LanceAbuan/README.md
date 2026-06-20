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
    "Lance Abuan — Full-stack developer and AI enthusiast. Enterprise software, chess engines, and machine learning.",
  keywords: [
    "Lance Abuan",
    "full-stack developer",
    "portfolio",
    "TypeScript",
    "React",
    "Next.js",
    "Python",
    "AI",
    "machine learning",
    "chess engine",
  ],
  authors: [{ name: "Lance Abuan" }],
  openGraph: {
    title: "Lance Abuan — Developer & Creator",
    description:
      "Lance Abuan — Full-stack developer and AI enthusiast. Enterprise software, chess engines, and machine learning.",
    type: "website",
    locale: "en_US",
    siteName: "Lance Abuan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lance Abuan — Developer & Creator",
    description:
      "Lance Abuan — Full-stack developer and AI enthusiast. Enterprise software, chess engines, and machine learning.",
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
