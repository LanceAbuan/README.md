import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    name: "AI Agent Orchestrator",
    description:
      "Multi-agent workflow engine that coordinates LLM-powered agents for complex task decomposition, tool use, and autonomous decision-making. Built with LangChain and custom tool registries.",
    tags: ["Python", "LangChain", "LLM", "Agentic AI", "RAG"],
    github: "https://github.com/LanceAbuan/agent-orchestrator",
    demo: null,
    featured: true,
  },
  {
    name: "OpenClaw Qwen Portfolio",
    description:
      "This portfolio — built entirely using OpenClaw with a local Qwen 27B model. Demonstrates human-in-the-loop AI development with PR-based code review workflows.",
    tags: ["Next.js", "OpenClaw", "Qwen", "AI Dev", "shadcn/ui"],
    github: "https://github.com/LanceAbuan/README.md",
    demo: null,
    featured: true,
  },
  {
    name: "Godot Microbe Simulator",
    description:
      "Interactive microbiology simulator featuring a hex-grid environment, procedurally generated infinite world, NPC systems, and dynamic resource creation. Used in classroom curriculum for hands-on learning.",
    tags: ["Godot", "GDScript", "Procedural Generation", "Education"],
    github: "https://github.com/LanceAbuan/godot-microbe-sim",
    demo: null,
    featured: false,
  },
  {
    name: "Arrow Rust Benchmark",
    description:
      "Performance benchmarking suite for Apache Arrow in Rust, comparing different serialization and query execution strategies.",
    tags: ["Rust", "Apache Arrow", "Benchmarking", "Systems"],
    github: "https://github.com/LanceAbuan/arrow-rs-benchmark",
    demo: null,
    featured: false,
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
