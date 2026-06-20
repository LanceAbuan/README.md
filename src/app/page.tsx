"use client";

import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
    </>
  );
}
