export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo: string | null;
  featured: boolean;
  language: string | null;
  stars: number;
  updated_at: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}
