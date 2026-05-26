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
 * Look up a Lucide icon component by kebab-case name.
 * Returns `Mail` as fallback for unknown names.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail;
}
