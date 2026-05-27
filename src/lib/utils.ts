import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging Tailwind CSS classes without conflicts.
 * Uses clsx for conditional class handling and twMerge to resolve
 * conflicting Tailwind utilities (e.g., multiple padding classes).
 *
 * @example
 * ```tsx
 * <div className={cn("p-4 bg-red", isActive && "bg-blue")}>
 *   { /* Result: "p-4 bg-blue" — twMerge resolves the conflict *\/ }
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
