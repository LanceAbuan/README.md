import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  GitFork,
  ExternalLink,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  mail: Mail,
  "git-fork": GitFork,
  "external-link": ExternalLink,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mail;
}
