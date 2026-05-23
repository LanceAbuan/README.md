import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
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
    name: "Arrow Rust Benchmark",
    description:
      "Performance benchmarking suite for Apache Arrow in Rust, comparing different serialization and query execution strategies.",
    tags: ["Rust", "Apache Arrow", "Benchmarking", "Systems"],
    github: "https://github.com/LanceAbuan/arrow-rs-benchmark",
    demo: null,
    featured: false,
  },
  {
    name: "OpenClaw macOS Build",
    description:
      "Build configuration and tooling for OpenClaw on macOS, including native plugin support and cross-platform compatibility layers.",
    tags: ["Rust", "macOS", "Build Tools", "OpenClaw"],
    github: "https://github.com/LanceAbuan/openclaw-macos-build",
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
