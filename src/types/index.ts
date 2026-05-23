export interface Stat {
  icon: string;
  label: string;
  value: string;
}

export interface AboutParagraph {
  text: string;
  highlights?: string[];
}

export interface AboutData {
  paragraphs: AboutParagraph[];
  stats: Stat[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: string;
  location: string;
  description: string;
  skills: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo: string | null;
  featured: boolean;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface ContactLink {
  icon: string;
  label: string;
  href: string;
}
