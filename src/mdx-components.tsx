import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold tracking-tight mt-8 mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, ...props }) => {
      const isInternal = href?.startsWith("/");
      if (isInternal) {
        return (
          <Link href={href!} className="underline underline-offset-4 decoration-neutral-400 hover:decoration-foreground transition-colors" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-neutral-400 hover:decoration-foreground transition-colors" {...props}>
          {children}
        </a>
      );
    },
    img: ({ src, alt, ...props }) => (
      <div className="my-6 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700/50">
        <Image
          src={src!}
          alt={alt || ""}
          width={800}
          height={450}
          className="w-full h-auto"
          {...props}
        />
      </div>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-700 dark:text-neutral-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-700 dark:text-neutral-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    code: ({ children, className, ...props }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 overflow-x-auto my-4">
            <code className={`text-sm ${className || ""}`} {...props}>
              {children}
            </code>
          </pre>
        );
      }
      return (
        <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic text-neutral-600 dark:text-neutral-400 my-4" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-700" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-left font-semibold bg-neutral-50 dark:bg-neutral-800" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2" {...props}>
        {children}
      </td>
    ),
    pre: ({ children, ...props }) => (
      <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 overflow-x-auto my-4" {...props}>
        {children}
      </pre>
    ),
    ...components,
  };
}
