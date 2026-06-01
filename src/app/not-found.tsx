import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedBackground } from "@/components/layout/background";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold text-neutral-200 dark:text-neutral-800">404</p>
          <h1 className="text-2xl font-bold tracking-tight mt-4 mb-2">Page not found</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className={buttonVariants({ className: "rounded-full px-6" })}>
            Back Home
          </Link>
        </div>
      </div>
    </>
  );
}
