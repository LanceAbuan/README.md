import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    name: "OpenClaw Qwen Portfolio",
    description:
      "This portfolio — built entirely using OpenClaw with a local Qwen model. Demonstrates human-in-the-loop AI development with PR-based code review workflows. Features multiple theme modes including terminal and newspaper layouts.",
    tags: ["Next.js", "OpenClaw", "Qwen", "AI Dev", "shadcn/ui"],
    github: "https://github.com/LanceAbuan/README.md",
    demo: "https://lanceabuan.com",
    featured: true,
  },
  {
    name: "Godot Microbe Simulator",
    description:
      "Interactive microbiology simulator featuring a hex-grid environment, procedurally generated infinite world, NPC systems, and dynamic resource creation. Used in classroom curriculum for hands-on learning.",
    tags: ["Godot", "GDScript", "Procedural Generation", "Education"],
    github: "https://github.com/LanceAbuan/godot-microbe-sim",
    demo: null,
    featured: true,
  },
  {
    name: "Web Poker",
    description:
      "Browser-based Texas Hold'em poker game with real-time multiplayer functionality and AI opponents.",
    tags: ["TypeScript", "WebSockets", "Game Dev", "Real-time"],
    github: "https://github.com/LanceAbuan/web-poker",
    demo: null,
    featured: false,
  },
];

export const githubProfileUrl = "https://github.com/LanceAbuan";
