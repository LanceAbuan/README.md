import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  GitFork,
  ExternalLink,
} from "lucide-react";

/**
 * Registry mapping string keys to Lucide icon components.
 * Used by data files (about, contact, etc.) to reference icons by name
 * instead of importing each icon individually.
 */
const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  mail: Mail,
  "git-fork": GitFork,
  "external-link": ExternalLink,
};

/**
 * Looks up a Lucide icon by its string key in the icon registry.
 * Falls back to Mail if the key isn't found.
 *
 * @param name - The icon key (e.g., "brain", "git-fork").
 * @returns The matched LucideIcon component, or Mail as fallback.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail;
}
