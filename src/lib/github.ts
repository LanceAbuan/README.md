import type { ProjectItem } from "@/types";

const GITHUB_USERNAME = "LanceAbuan";

const FEATURED_REPOS: ProjectItem[] = [
  {
    name: "TheFoolsGambitPython",
    description:
      "An AlphaZero-inspired chess AI that learns entirely through self-play, with a live-training dashboard you can watch in real time. Built with Python, PyTorch, React, and Mantine.",
    tags: ["Python", "PyTorch", "React", "Mantine", "AI", "Chess"],
    github: `https://github.com/${GITHUB_USERNAME}/TheFoolsGambitPython`,
    demo: "https://gambit.lanceabuan.tech",
    featured: true,
    language: "Python",
    stars: 1,
    updated_at: "2026-06-20T00:00:00Z",
  },
  {
    name: "README.md",
    description:
      "This portfolio site — built with Next.js 16, Mantine, Framer Motion, and Tailwind CSS. Features elaborate animations, dark mode, and auto-pulled GitHub projects.",
    tags: ["Next.js", "TypeScript", "Mantine", "Framer Motion", "Tailwind"],
    github: `https://github.com/${GITHUB_USERNAME}/README.md`,
    demo: "https://lanceabuan.com",
    featured: true,
    language: "TypeScript",
    stars: 1,
    updated_at: "2026-06-20T00:00:00Z",
  },
  {
    name: "SnakeAI",
    description:
      "An environment to train a snake AI using reinforcement learning, with a GUI to watch it play and the corresponding trained models.",
    tags: ["Python", "Reinforcement Learning", "AI", "GUI"],
    github: `https://github.com/${GITHUB_USERNAME}/SnakeAI`,
    demo: null,
    featured: true,
    language: "Python",
    stars: 0,
    updated_at: "2025-03-31T00:00:00Z",
  },
  {
    name: "AICompendium",
    description:
      "A collection of multiple AI environments using OpenAI Gym, including custom environments like Tic-Tac-Toe for reinforcement learning research.",
    tags: ["Python", "OpenAI Gym", "Reinforcement Learning", "AI"],
    github: `https://github.com/${GITHUB_USERNAME}/AICompendium`,
    demo: null,
    featured: false,
    language: "Python",
    stars: 0,
    updated_at: "2025-02-25T00:00:00Z",
  },
];

export async function fetchGitHubRepos(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
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

    const repos = await res.json();

    const apiProjects: ProjectItem[] = repos
      .filter(
        (r: { fork: boolean; name: string }) =>
          !r.fork &&
          !FEATURED_REPOS.some((f) => f.name === r.name)
      )
      .map(
        (r: {
          name: string;
          description: string | null;
          html_url: string;
          homepage: string | null;
          topics: string[];
          language: string | null;
          stargazers_count: number;
          updated_at: string;
        }) => ({
          name: r.name,
          description: r.description ?? "No description provided.",
          tags: r.topics?.length
            ? r.topics.slice(0, 5)
            : [r.language ?? "Code"].filter(Boolean),
          github: r.html_url,
          demo: r.homepage || null,
          featured: false,
          language: r.language,
          stars: r.stargazers_count,
          updated_at: r.updated_at,
        })
      );

    return [...FEATURED_REPOS, ...apiProjects];
  } catch {
    return FEATURED_REPOS;
  }
}
