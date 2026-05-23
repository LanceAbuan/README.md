import { Separator } from "@/components/ui/separator";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <Separator className="w-full" />
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          © {year} Lance Abuan. Built with Next.js & shadcn/ui.
        </p>
      </div>
    </footer>
  );
}
