import type { GitHubRepo, ProjectItem } from "@/types";

const GITHUB_USERNAME = "LanceAbuan";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

const FEATURED_REPOS = [
  "README.md",
  "godot-microbe-sim",
  "web-poker",
];

export async function fetchGitHubRepos(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}?sort=updated&per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("GitHub API error");

    const repos: GitHubRepo[] = await res.json();

    return repos
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description ?? "No description provided.",
        tags: repo.topics?.length
          ? repo.topics.slice(0, 5)
          : [repo.language ?? "Code"].filter(Boolean),
        github: repo.html_url,
        demo: repo.homepage || null,
        featured: FEATURED_REPOS.includes(repo.name),
        language: repo.language,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
      }))
      .sort((a, b) => {
        const aFeatured = FEATURED_REPOS.indexOf(a.name);
        const bFeatured = FEATURED_REPOS.indexOf(b.name);
        const aIdx = aFeatured === -1 ? 999 : aFeatured;
        const bIdx = bFeatured === -1 ? 999 : bFeatured;
        return aIdx - bIdx;
      });
  } catch {
    return getFallbackProjects();
  }
}

function getFallbackProjects(): ProjectItem[] {
  return [
    {
      name: "README.md",
      description:
        "This portfolio — built with Next.js, Mantine, and Framer Motion. Features multiple theme modes and elaborate animations.",
      tags: ["Next.js", "Mantine", "Framer Motion", "TypeScript"],
      github: `https://github.com/${GITHUB_USERNAME}/README.md`,
      demo: "https://lanceabuan.com",
      featured: true,
      language: "TypeScript",
      stars: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "godot-microbe-sim",
      description:
        "Interactive microbiology simulator featuring a hex-grid environment, procedurally generated infinite world, and NPC systems.",
      tags: ["Godot", "GDScript", "Procedural Generation", "Education"],
      github: `https://github.com/${GITHUB_USERNAME}/godot-microbe-sim`,
      demo: null,
      featured: true,
      language: "GDScript",
      stars: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "web-poker",
      description:
        "Browser-based Texas Hold'em poker game with real-time multiplayer functionality and AI opponents.",
      tags: ["TypeScript", "WebSockets", "Game Dev", "Real-time"],
      github: `https://github.com/${GITHUB_USERNAME}/web-poker`,
      demo: null,
      featured: true,
      language: "TypeScript",
      stars: 0,
      updated_at: new Date().toISOString(),
    },
  ];
}
